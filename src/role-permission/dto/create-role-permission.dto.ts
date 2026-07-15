import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PermissionMatrixItemDto {
  @ApiProperty({
    example: 'student-page',
    description: 'Module or page key to control permissions for',
  })
  @IsString()
  @IsNotEmpty()
  page!: string;

  @ApiProperty({ example: true, description: 'Allow create action' })
  @IsBoolean()
  create!: boolean;

  @ApiProperty({ example: true, description: 'Allow read action' })
  @IsBoolean()
  read!: boolean;

  @ApiProperty({ example: false, description: 'Allow update action' })
  @IsBoolean()
  update!: boolean;

  @ApiProperty({ example: false, description: 'Allow delete action' })
  @IsBoolean()
  delete!: boolean;
}

export class CreateRolePermissionDto {
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique role-permission id. Auto-generated if omitted.',
  })
  @IsOptional()
  @IsUUID('4', { message: 'id must be a valid UUID v4' })
  id?: string;

  @ApiProperty({
    example: 'teacher',
    description: 'Role permission name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Teacher role access matrix',
    description: 'Description of the role permission',
  })
  @IsString()
  @IsNotEmpty()
  desc?: string;

  @ApiProperty({
    type: [PermissionMatrixItemDto],
    description: 'Permission matrix per module/page',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionMatrixItemDto)
  matrix!: PermissionMatrixItemDto[];
}
