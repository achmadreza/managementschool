import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import {
  UpdateBillingDto,
  UpdateBillingStatusDto,
} from './dto/update-billing.dto';
import { UploadBillingFileDto } from './dto/upload-billing-file.dto';
import { BillingStatus } from './schemas/billing.schema';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('billings')
@Controller('billings')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new billing record' })
  create(@Body() createBillingDto: CreateBillingDto) {
    return this.billingService.create(createBillingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all billing records or filter by search/status/studentId',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description:
      'Search keyword for invoice number, student ID, or school code',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: BillingStatus,
    description: 'Filter by billing status',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter by student ID',
  })
  findAll(
    @Query('q') q?: string,
    @Query('status') status?: BillingStatus,
    @Query('studentId') studentId?: string,
  ) {
    return this.billingService.findAll(q, status, studentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get billing record by ID' })
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update billing record' })
  update(@Param('id') id: string, @Body() updateBillingDto: UpdateBillingDto) {
    return this.billingService.update(id, updateBillingDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update billing status' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateBillingStatusDto: UpdateBillingStatusDto,
  ) {
    return this.billingService.updateStatus(id, updateBillingStatusDto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete billing record' })
  delete(@Param('id') id: string) {
    return this.billingService.delete(id);
  }

  @Post(':id/upload')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Upload a base64 payment attachment for a billing record',
  })
  uploadBillingRecords(
    @Param('id') id: string,
    @Body() uploadBillingFileDto: UploadBillingFileDto,
  ) {
    return this.billingService.uploadBillingRecords(
      id,
      uploadBillingFileDto.file,
    );
  }
}
