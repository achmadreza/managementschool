import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BillingStatus } from '../schemas/billing.schema';
import { PaymentItemDto } from './create-billing.dto';

export class UpdateBillingDto {
  @ApiProperty({
    example: 'INV-2026-0001',
    description: 'Unique invoice number',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  invoiceNumber?: string;

  @ApiProperty({
    example: 'student-001',
    description: 'Student identifier linked to this bill',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  studentId?: string;

  @ApiProperty({
    example: 'Budi Santoso',
    description: 'Optional student full name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  studentName?: string;

  @ApiProperty({
    example: '5A',
    description: 'Optional student class',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  studentClass?: string;

  @ApiProperty({
    example: 'SCH001',
    description: 'Optional school code',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  schoolCode?: string;

  @ApiProperty({
    example: 'parent-001',
    description: 'Optional parent user identifier',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  parentId?: string;

  @ApiProperty({
    example: 'parent@example.com',
    description: 'Optional parent email address',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  parentEmail?: string;

  @ApiProperty({
    example: 'Registration fee for semester 1',
    description: 'Optional billing description',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    type: [PaymentItemDto],
    example: [{ paymentType: 'Registration fee', amount: 1250000 }],
    description: 'Payment item list',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  @IsOptional()
  paymentList?: PaymentItemDto[];

  @ApiProperty({
    example: '2026-09-15',
    description: 'Invoice due date in ISO format (YYYY-MM-DD)',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({
    enum: BillingStatus,
    example: BillingStatus.WAITING,
    description: 'Payment status',
    required: false,
  })
  @IsEnum(BillingStatus)
  @IsOptional()
  status?: BillingStatus;

  @ApiProperty({
    example: '2026-09-12T10:00:00.000Z',
    description: 'Payment date in ISO format when paid',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  paidAt?: Date;

  @ApiProperty({
    example: 'bank-transfer',
    description: 'Optional payment method or reference',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  payment?: string;
}

export class UpdateBillingStatusDto {
  @ApiProperty({
    enum: BillingStatus,
    example: BillingStatus.PAID,
    description: 'New billing payment status',
  })
  @IsEnum(BillingStatus)
  status!: BillingStatus;
}
