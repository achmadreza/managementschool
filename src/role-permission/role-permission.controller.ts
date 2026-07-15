import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { RolePermissionService } from './role-permission.service';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post('permision-role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  createRolePermission(
    @Body() createRolePermissionDto: CreateRolePermissionDto,
  ) {
    return this.rolePermissionService.createRolePermission(
      createRolePermissionDto,
    );
  }
}
