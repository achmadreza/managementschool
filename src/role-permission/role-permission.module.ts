import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';
import {
  RolePermission,
  RolePermissionSchema,
} from './schemas/role-permission.schema';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'school-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forFeature([
      { name: RolePermission.name, schema: RolePermissionSchema },
    ]),
  ],
  controllers: [RolePermissionController],
  providers: [RolesGuard, RolePermissionService, JwtAuthGuard],
  exports: [RolesGuard, RolePermissionService, MongooseModule],
})
export class RolePermissionModule {}
