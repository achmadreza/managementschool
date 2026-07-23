import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'currentPassword123',
    minLength: 8,
    description: 'Current password',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  currentPassword!: string;

  @ApiProperty({
    example: 'newPassword123',
    minLength: 8,
    description: 'New password',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  newPassword!: string;
}
