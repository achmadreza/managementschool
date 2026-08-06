import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  Matches,
  // Match,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

const normalizePhoneNumber = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  const hasLeadingPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');

  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
};

export class CreateUserDto {
  // @ApiPropertyOptional({
  //   example: 'u-9b8a7c6d',
  //   description: 'Unique user id. Auto-generated if omitted.',
  // })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Aryo Bimo', description: 'User full name' })
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName: string | undefined;

  @ApiProperty({
    example: 'aryo@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string | undefined;

  @ApiProperty({
    example: 'secret123',
    minLength: 8,
    description: 'User account password',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string | undefined;

  @ApiPropertyOptional({
    example: '+6281234567890',
    description: 'Optional phone number',
  })
  @IsOptional()
  @Transform(({ value }) => normalizePhoneNumber(value))
  @IsString()
  @Matches(/^[0-9\-+\s()]*$/, { message: 'Invalid phone format' })
  phone?: string;

  @ApiProperty({
    example: 'PETANG03',
    description: 'school code associated with the user',
  })
  @IsString()
  schoolCode!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.PARENT,
    description: 'Role assigned to the user',
  })
  @IsEnum(UserRole, { message: 'Invalid role' })
  role: UserRole | undefined;

  @ApiPropertyOptional({
    example: 'google-oauth-user-id-12345',
    description: 'Google OAuth identifier if user signs in with Google',
  })
  @IsOptional()
  @IsString()
  googleOAuthID?: string;

  @ApiProperty({
    example: 'secret123',
    minLength: 8,
    description: 'Must match password',
  })
  @IsString()
  @MinLength(8, { message: 'Confirm password must be at least 8 characters' })
  confirmPassword: string | undefined;
}
