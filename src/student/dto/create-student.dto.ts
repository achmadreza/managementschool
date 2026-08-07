import {
  IsEnum,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { StudentStatus } from '../schemas/student.schema';

const normalizePhoneNumber = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  const hasLeadingPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');

  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
};

export class CreateStudentDto {
  @ApiProperty({
    example: 'PETANG03',
    description: 'School code associated with this student',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  schoolCode?: string;

  @ApiProperty({ example: 'Budi Santoso', description: 'Student full name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: '5A', description: 'Class name/label' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  class!: string;

  @ApiProperty({ example: 'male', description: 'Student gender' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  gender!: string;

  @ApiProperty({
    enum: StudentStatus,
    example: StudentStatus.PROCESS,
    description: 'Student registration status',
    required: false,
  })
  @IsEnum(StudentStatus)
  @IsOptional()
  status?: StudentStatus;

  @ApiProperty({ example: 'Jl. Melati No. 1', description: 'Home address' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string;

  @ApiProperty({ example: 'Bandung', description: 'Student birth place' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  birthPlace!: string;

  @ApiProperty({
    example: '2015-03-12',
    description: 'Birthdate in ISO format (YYYY-MM-DD)',
  })
  @IsDateString()
  birthdate!: string;

  @ApiProperty({
    example: 'parent-001',
    description: 'Parent user identifier',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  parentId?: string;

  @ApiProperty({
    example: 'parent@example.com',
    description: 'Parent email address',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  parentEmail!: string;

  @ApiProperty({
    example: 'Siti Aminah',
    description: 'Parent or guardian full name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  parentName?: string;

  @ApiProperty({
    example: '+6281234567890',
    description: 'Parent/guardian phone number',
  })
  @Transform(({ value }) => normalizePhoneNumber(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phoneNumber!: string;

  @ApiProperty({
    example: '+6281122233344',
    description: 'Emergency contact phone number',
  })
  @Transform(({ value }) => normalizePhoneNumber(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  emergencyContact!: string;

  @ApiProperty({ example: '2026/2027', description: 'Current school year' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  schoolYear!: string;

  @ApiProperty({
    example: '3276012345678901',
    description: 'Family card number / path reference',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  kk!: string;

  @ApiProperty({
    example: 'birth-certificate-001.pdf',
    description: 'Birth certificate path or reference',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  birthCertificate!: string;

  @ApiProperty({
    example: 'student-photo-001.jpg',
    description: 'Student photo path or reference',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  photo!: string;
}
