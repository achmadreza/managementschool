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
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import {
  UpdateStudentDto,
  UpdateStudentStatusDto,
} from './dto/update-student.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new student' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all students or search by name/id/class' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search keyword for student name, id, or class',
  })
  findAll(@Req() req: Request, @Query('q') q?: string) {
    return this.studentService.findAll(req, q);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get student by ID' })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update student' })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update student status' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStudentStatusDto: UpdateStudentStatusDto,
  ) {
    return this.studentService.updateStatus(id, updateStudentStatusDto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete student' })
  delete(@Param('id') id: string) {
    return this.studentService.delete(id);
  }
}
