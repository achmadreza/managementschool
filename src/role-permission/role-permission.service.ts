import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import {
  RolePermission,
  RolePermissionDocument,
} from './schemas/role-permission.schema';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectModel(RolePermission.name)
    private readonly rolePermissionModel: Model<RolePermissionDocument>,
  ) {}

  async createRolePermission(
    createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    const existingRolePermission = await this.rolePermissionModel.findOne(
      createRolePermissionDto.id
        ? {
            $or: [
              { name: createRolePermissionDto.name.toLowerCase() },
              { id: createRolePermissionDto.id },
            ],
          }
        : { name: createRolePermissionDto.name.toLowerCase() },
    );

    if (existingRolePermission) {
      throw new ConflictException('Role permission already exists');
    }

    const rolePermission = new this.rolePermissionModel(
      createRolePermissionDto,
    );
    return rolePermission.save();
  }
}
