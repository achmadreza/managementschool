import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('schools')
@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new school' })
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolService.create(createSchoolDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all schools or filter by id/code' })
  @ApiQuery({ name: 'id', required: false, description: 'Filter by school ID' })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Filter by school code',
  })
  findAll(@Query('id') id?: string, @Query('code') code?: string) {
    return this.schoolService.findAll(id, code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school by ID' })
  findOne(@Param('id') id: string) {
    return this.schoolService.findOne(id);
  }

  //   @Get('code/:code')
  //   @ApiOperation({ summary: 'Get school by code' })
  //   findByCode(@Param('code') code: string) {
  //     return this.schoolService.findByCode(code);
  //   }

  @Put(':id')
  @ApiOperation({ summary: 'Update school' })
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete school' })
  delete(@Param('id') id: string) {
    return this.schoolService.delete(id);
  }
}
