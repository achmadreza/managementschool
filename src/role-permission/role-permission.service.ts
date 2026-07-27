import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
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

  async getRolePermissionById(id: string): Promise<RolePermission> {
    const rolePermission = await this.rolePermissionModel.findOne({ id });

    if (!rolePermission) {
      throw new NotFoundException(`Role permission with id ${id} not found`);
    }

    return rolePermission;
  }

  async updateRolePermission(
    id: string,
    updateRolePermissionDto: UpdateRolePermissionDto,
  ): Promise<RolePermission> {
    const rolePermission = await this.rolePermissionModel.findOne({ id });

    if (!rolePermission) {
      throw new NotFoundException(`Role permission with id ${id} not found`);
    }

    // Check if name is being updated and if it already exists
    if (
      updateRolePermissionDto.name &&
      updateRolePermissionDto.name.toLowerCase() !== rolePermission.name
    ) {
      const existingRolePermission = await this.rolePermissionModel.findOne({
        name: updateRolePermissionDto.name.toLowerCase(),
      });

      if (existingRolePermission) {
        throw new ConflictException(
          'Role permission with this name already exists',
        );
      }
    }

    const updatedRolePermission =
      await this.rolePermissionModel.findOneAndUpdate(
        { id },
        {
          name: updateRolePermissionDto.name
            ? updateRolePermissionDto.name.toLowerCase()
            : rolePermission.name,
          desc: updateRolePermissionDto.desc || rolePermission.desc,
          matrix: updateRolePermissionDto.matrix || rolePermission.matrix,
        },
        { new: true },
      );

    return updatedRolePermission!;
  }

  async deleteRolePermission(id: string): Promise<{ message: string }> {
    const rolePermission = await this.rolePermissionModel.findOne({ id });

    if (!rolePermission) {
      throw new NotFoundException(`Role permission with id ${id} not found`);
    }

    await this.rolePermissionModel.deleteOne({ id });

    return { message: 'Role permission deleted successfully' };
  }
}
