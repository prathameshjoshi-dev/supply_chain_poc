import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../../database/schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { EmailService } from '../../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private auditLogsService: AuditLogsService,
    private emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const { password, ...userData } = createUserDto;
    
    const createdUser = new this.userModel({
      ...userData,
      passwordHash,
    });
    
    const saved = await createdUser.save();
    
    // Log the event
    await this.auditLogsService.logEvent({
      action: 'CREATE',
      entity: 'User',
      entityId: saved.name,
      severity: 'success'
    });

    // Send the invite email asynchronously
    this.emailService.sendUserInvite(saved.email, saved.name, password).catch(console.error);

    const result: any = saved.toObject();
    delete result.passwordHash;
    return result;
  }

  async findAll(query: any = {}) {
    const { page = 1, limit = 10, search, role, warehouseScope } = query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role && role !== 'All Roles') filter.role = role.toLowerCase();
    if (warehouseScope && warehouseScope !== 'All Scopes') filter.warehouseScope = warehouseScope;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel.find(filter).select('-passwordHash').skip(skip).limit(Number(limit)).exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash').exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateData: any = { ...updateUserDto };
    
    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateData.password;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-passwordHash')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // Log the event
    await this.auditLogsService.logEvent({
      action: 'UPDATE',
      entity: 'User',
      entityId: updatedUser.name,
      severity: 'info'
    });

    return updatedUser;
  }

  async remove(id: string) {
    // Soft delete implementation
    const deletedUser = await this.userModel
      .findByIdAndUpdate(id, { status: 'inactive' }, { new: true })
      .select('-passwordHash')
      .exec();

    if (!deletedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // Log the event
    await this.auditLogsService.logEvent({
      action: 'DELETE',
      entity: 'User',
      entityId: deletedUser.name,
      severity: 'critical'
    });

    return deletedUser;
  }

  async bulkAction(userIds: string[], action: string) {
    if (action === 'delete' || action === 'suspend') {
      const result = await this.userModel.updateMany(
        { _id: { $in: userIds } },
        { $set: { status: 'inactive' } }
      ).exec();

      // Log the bulk event
      await this.auditLogsService.logEvent({
        action: 'UPDATE',
        entity: 'Users Bulk Action',
        entityId: `${userIds.length} users ${action}d`,
        severity: 'warning'
      });

      return { modifiedCount: result.modifiedCount };
    }
    return { modifiedCount: 0 };
  }

  async getInsights() {
    const totalCount = await this.userModel.countDocuments();
    const adminCount = await this.userModel.countDocuments({ role: 'admin' });
    const activeCount = await this.userModel.countDocuments({ status: 'active' });
    const activePercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
    
    return {
      totalCapacity: totalCount,
      adminAccounts: adminCount,
      activePercentage,
    };
  }

  // Inter-module method used by Auth service
  async findByEmailForAuth(email: string) {
    return this.userModel.findOne({ email, status: 'active' }).exec();
  }
}
