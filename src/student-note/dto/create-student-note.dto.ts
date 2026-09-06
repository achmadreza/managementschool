import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { StudentNoteCategory } from '../schemas/student-note.schema';

export class CreateStudentNoteDto {
  @ApiProperty({ example: 'student-uuid', description: 'Student ID' })
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty({
    example: 'parent-uuid',
    description: 'Parent ID',
  })
  @IsString()
  @IsNotEmpty()
  parentId!: string;

  @ApiProperty({
    enum: StudentNoteCategory,
    enumName: 'StudentNoteCategory',
    example:
      StudentNoteCategory.PROGRESS +
      ` the list: [${Object.values(StudentNoteCategory).join(', ')}]`,
    description: 'Student note category',
  })
  @IsEnum(StudentNoteCategory)
  category!: StudentNoteCategory;

  @ApiProperty({
    example: '2026-09-06T09:00:00.000Z',
    description: 'Date and time the note was recorded',
  })
  @IsDateString()
  notedAt!: string;

  @ApiProperty({ example: 4, description: 'Indicator score or value' })
  @IsNumber()
  @Min(0)
  indicator!: number;

  @ApiProperty({
    example: 'Learning progress',
    description: 'Optional note title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    example: 'Shows strong participation during reading activities.',
    description: 'Optional note description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

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

  @ApiProperty({
    example: 'Practice reading for 15 minutes each day.',
    description: 'Optional suggested action',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  suggestion?: string | null;

  @ApiProperty({
    example: 'Needs additional support with sentence construction.',
    description: 'Optional attention note',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  attention?: string | null;

  @ApiProperty({
    example: 'Review progress with the parent next week.',
    description: 'Optional follow-up action',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  followUp?: string | null;
}
