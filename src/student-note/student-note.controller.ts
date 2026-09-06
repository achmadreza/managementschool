import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateStudentNoteDto } from './dto/create-student-note.dto';
import { UpdateStudentNoteDto } from './dto/update-student-note.dto';
import { StudentNoteService } from './student-note.service';

@ApiTags('student-notes')
@Controller('student-notes')
@UseGuards(JwtAuthGuard)
export class StudentNoteController {
  constructor(private readonly studentNoteService: StudentNoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a student note' })
  create(@Body() createStudentNoteDto: CreateStudentNoteDto) {
    return this.studentNoteService.create(createStudentNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get student notes' })
  @ApiQuery({ name: 'studentId', required: false, description: 'Student ID' })
  findAll(@Req() req: any, @Query('studentId') studentId?: string) {
    return this.studentNoteService.findAll(req, studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student note by ID' })
  findOne(@Param('id') id: string) {
    return this.studentNoteService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a student note' })
  update(
    @Param('id') id: string,
    @Body() updateStudentNoteDto: UpdateStudentNoteDto,
  ) {
    return this.studentNoteService.update(id, updateStudentNoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student note' })
  delete(@Param('id') id: string) {
    return this.studentNoteService.delete(id);
  }
}
