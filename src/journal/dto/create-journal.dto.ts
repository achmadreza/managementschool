import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { JournalStatus } from '../schemas/journal.schema';

export class CreateJournalDto {
  @ApiProperty({
    example: 'class of student',
    description: 'Optional identifier for the journal target',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  target?: string | null;

  @ApiProperty({
    enum: JournalStatus,
    example: `${JournalStatus.DRAFT} or ${JournalStatus.PUBLISHED}`,
    description: 'Journal status',
  })
  @IsEnum(JournalStatus)
  @IsNotEmpty()
  status!: JournalStatus;

  @ApiProperty({
    example: 'Belajar menjaga kebersihan lingkungan',
    description: 'Optional journal title',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string | null;

  @ApiProperty({
    example: 'Anak-anak belajar membuang sampah pada tempatnya dengan baik',
    description: 'Optional journal message',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  message?: string | null;

  @ApiProperty({
    example: 'base64',
    description: 'Optional file URL or encoded file content',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000000)
  file?: string | null;

  @ApiProperty({
    example: 'base64',
    description: 'Optional photo URL or encoded photo content',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000000)
  photo?: string | null;
}
