import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSchoolDto {
  @ApiProperty({
    example: 'SCH001',
    description: 'School code',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  code?: string;

  @ApiProperty({
    example: 'ABC School',
    description: 'School name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  name?: string;
}
