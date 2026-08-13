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

export class CreateTrialClassDto {
  @ApiProperty({ example: 'parent-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  parentId!: string;

  @ApiProperty({ example: 'student-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  studentId!: string;

  @ApiProperty({ example: '2026-07-24T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  registeredAt!: Date;

  @ApiProperty({ enum: TrialClassStatus, required: false })
  @IsEnum(TrialClassStatus)
  @IsOptional()
  status?: TrialClassStatus;
}
