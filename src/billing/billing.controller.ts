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
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import {
  UpdateBillingDto,
  UpdateBillingStatusDto,
} from './dto/update-billing.dto';
import { BillingStatus } from './schemas/billing.schema';

@ApiTags('billings')
@Controller('billings')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new billing record' })
  create(@Body() createBillingDto: CreateBillingDto) {
    return this.billingService.create(createBillingDto);
  }

  @Get()
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
  @ApiOperation({ summary: 'Get billing record by ID' })
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update billing record' })
  update(@Param('id') id: string, @Body() updateBillingDto: UpdateBillingDto) {
    return this.billingService.update(id, updateBillingDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update billing status' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateBillingStatusDto: UpdateBillingStatusDto,
  ) {
    return this.billingService.updateStatus(id, updateBillingStatusDto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete billing record' })
  delete(@Param('id') id: string) {
    return this.billingService.delete(id);
  }
}
