import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

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
  @ApiOperation({ summary: 'Get all students or search by name/id/class' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search keyword for student name, id, or class',
  })
  findAll(@Query('q') q?: string) {
    return this.studentService.findAll(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update student' })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete student' })
  delete(@Param('id') id: string) {
    return this.studentService.delete(id);
  }
}
