import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BillingStatus } from '../schemas/billing.schema';

export class PaymentItemDto {
  @ApiProperty({ example: 'Registration fee' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  paymentType!: string;

  @ApiProperty({ example: 1250000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount!: number;
}

export class CreateBillingDto {
  //   @ApiProperty({
  //     example: 'INV-2026-0001',
  //     description: 'Unique invoice number',
  //   })
  //   @IsString()
  //   @IsNotEmpty()
  //   @MaxLength(100)
  //   invoiceNumber!: string;

  @ApiProperty({
    example: 'student-001',
    description: 'Student identifier linked to this bill',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  studentId!: string;

  //   @ApiProperty({
  //     example: 'SCH001',
  //     description: 'Optional school code',
  //     required: false,
  //   })
  //   @IsString()
  //   @IsOptional()
  //   @MaxLength(100)
  //   schoolCode?: string;

  //   @ApiProperty({
  //     example: 'parent-001',
  //     description: 'Optional parent user identifier',
  //     required: false,
  //   })
  //   @IsString()
  //   @IsOptional()
  //   @MaxLength(100)
  //   parentId?: string;

  //   @ApiProperty({
  //     example: 'parent@example.com',
  //     description: 'Optional parent email address',
  //     required: false,
  //   })
  //   @IsString()
  //   @IsOptional()
  //   @MaxLength(255)
  //   parentEmail?: string;

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
    description: 'Required list of payment items',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  paymentList!: PaymentItemDto[];

  @ApiProperty({
    example: '2026-09-12T10:00:00.000Z',
    description: 'Invoice due date in ISO format (YYYY-MM-DD)',
  })
  @Type(() => Date)
  @IsDate()
  dueDate!: Date;

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
}
