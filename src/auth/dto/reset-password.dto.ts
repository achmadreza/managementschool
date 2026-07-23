import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'reset-token-xyz',
    description: 'Password reset token',
  })
  @IsString()
  token!: string;

  @ApiProperty({
    example: 'newPassword123',
    minLength: 8,
    description: 'New password',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  newPassword!: string;
}
