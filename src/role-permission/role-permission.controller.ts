import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RolePermissionService } from './role-permission.service';

@ApiTags('role-permission')
@ApiBearerAuth('bearer')
@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post('permision-role')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new role permission' })
  createRolePermission(
    @Body() createRolePermissionDto: CreateRolePermissionDto,
  ) {
    return this.rolePermissionService.createRolePermission(
      createRolePermissionDto,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get role permission by ID' })
  getRolePermissionById(@Param('id') id: string) {
    return this.rolePermissionService.getRolePermissionById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update role permission' })
  updateRolePermission(
    @Param('id') id: string,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    return this.rolePermissionService.updateRolePermission(
      id,
      updateRolePermissionDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete role permission' })
  deleteRolePermission(@Param('id') id: string) {
    return this.rolePermissionService.deleteRolePermission(id);
  }
}
