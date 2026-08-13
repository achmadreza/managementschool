import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadBillingFileDto {
  @ApiProperty({
    example: 'data:application/pdf;base64,JVBERi0xLjQK...',
    description: 'Base64-encoded payment attachment',
  })
  @IsString()
  @IsNotEmpty()
  file!: string;
}
