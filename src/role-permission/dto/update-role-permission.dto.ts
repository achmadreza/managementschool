import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
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

export class UpdateRolePermissionDto {
  @ApiPropertyOptional({
    example: 'teacher',
    description: 'Role permission name',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    example: 'Teacher role access matrix',
    description: 'Description of the role permission',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  desc?: string;

  @ApiPropertyOptional({
    type: [PermissionMatrixItemDto],
    description: 'Permission matrix per module/page',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionMatrixItemDto)
  matrix?: PermissionMatrixItemDto[];
}
