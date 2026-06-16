import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../../database/schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
    const result: any = saved.toObject();
    delete result.passwordHash;
    return result;
  }

  async findAll() {
    return this.userModel.find().select('-passwordHash').exec();
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
    return deletedUser;
  }

  // Inter-module method used by Auth service
  async findByEmailForAuth(email: string) {
    return this.userModel.findOne({ email, status: 'active' }).exec();
  }
}
