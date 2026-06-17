import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../schemas/role.schema';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const roles = [
      {
        name: 'admin',
        displayName: 'Admin',
        permissions: [
          'auth.mfa_enforce', 'auth.api_keys', 'auth.password_override', 'auth.global_logout',
          'user.create', 'user.modify_rbac', 'user.bulk_import', 'user.delete_core',
          'workflow.pipeline', 'workflow.critical_alert',
          'report.financial', 'report.ai_finetune'
        ],
      },
      {
        name: 'manager',
        displayName: 'Manager',
        permissions: [
          'user.create', 'user.bulk_import',
          'workflow.pipeline', 'workflow.critical_alert',
          'report.financial'
        ],
      },
      {
        name: 'supervisor',
        displayName: 'Supervisor',
        permissions: [
          'user.create',
          'workflow.pipeline'
        ],
      },
      {
        name: 'viewer',
        displayName: 'Viewer',
        permissions: [
          'report.financial'
        ],
      },
    ];

    for (const role of roles) {
      const existingRole = await this.roleModel.findOne({ name: role.name });
      if (!existingRole) {
        await this.roleModel.create(role);
      }
    }
  }

  async findAll() {
    return this.roleModel.find().exec();
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const updatedRole = await this.roleModel.findByIdAndUpdate(
      id,
      { $set: updateRoleDto },
      { new: true }
    ).exec();

    if (!updatedRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return updatedRole;
  }
}
