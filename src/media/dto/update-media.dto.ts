import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMediaDto {
  @ApiProperty({
    example: 'Student activity photo',
    description: 'Optional media title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
    description: 'Optional base64-encoded media or media URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000000)
  file?: string;

  @ApiProperty({
    example: 'Photo from the school clean-up activity',
    description: 'Optional media description',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string | null;
}
