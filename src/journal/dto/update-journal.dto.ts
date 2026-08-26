import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { JournalStatus } from '../schemas/journal.schema';

export class UpdateJournalDto {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  target?: string | null;

  @ApiProperty({ enum: JournalStatus, required: false })
  @IsOptional()
  @IsEnum(JournalStatus)
  status?: JournalStatus;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  message?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10000000)
  file?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10000000)
  photo?: string | null;
}
