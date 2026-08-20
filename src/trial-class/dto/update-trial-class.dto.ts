import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TrialClassStatus } from '../schemas/trial-class.schema';

export class UpdateTrialClassDto {
  @ApiProperty({ example: 'parent-001', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  parentId?: string;

  @ApiProperty({ example: 'student-001', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  studentId?: string;

  @ApiProperty({ example: 'base64', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  teacherId?: string;

  @ApiProperty({ example: '2026-07-24T00:00:00.000Z', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  registeredAt?: Date;

  @ApiProperty({
    example: '2026-07-25T10:00:00.000Z',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduledAt?: Date;

  @ApiProperty({ example: 'Kelas 5A', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @ApiProperty({ enum: TrialClassStatus, required: false })
  @IsEnum(TrialClassStatus)
  @IsOptional()
  status?: TrialClassStatus;
}

export class UpdateTrialClassStatusDto {
  @ApiProperty({ enum: TrialClassStatus, example: TrialClassStatus.APPROVED })
  @IsEnum(TrialClassStatus)
  status!: TrialClassStatus;
}
