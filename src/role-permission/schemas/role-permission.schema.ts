import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';
import { UserRole } from '../../auth/enums/user-role.enum';

export type RolePermissionDocument = HydratedDocument<RolePermission>;

export type PermissionMatrix = {
  page: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}[];

@Schema({ timestamps: true })
export class RolePermission {
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: randomUUID,
    match:
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  })
  id!: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  name!: string;

  @Prop({ type: String, enum: UserRole, trim: true, lowercase: true })
  role?: UserRole;

  @Prop({ required: true, trim: true })
  desc!: string;

  @Prop({ type: Object, required: true, default: {} })
  matrix!: PermissionMatrix;
}

export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermission);
