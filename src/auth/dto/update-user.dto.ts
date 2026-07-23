import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'User full name',
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiPropertyOptional({
    example: '+62 812 3456 7890',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9\-+\s()]*$/, { message: 'Invalid phone format' })
  phone?: string;

  @ApiPropertyOptional({
    example: 'PETANG03',
    description: 'User code',
  })
  @IsString()
  schoolCode!: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.PARENT,
    description: 'Role assigned to the user',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role' })
  role?: UserRole;
}
