import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { UserRole } from '../auth/enums/user-role.enum';
import { Student, StudentDocument } from '../student/schemas/student.schema';
import { CreateStudentNoteDto } from './dto/create-student-note.dto';
import { UpdateStudentNoteDto } from './dto/update-student-note.dto';
import {
  StudentNote,
  StudentNoteDocument,
} from './schemas/student-note.schema';

interface AuthenticatedRequest {
  user?: {
    id: string;
    role: UserRole;
  };
}

@Injectable()
export class StudentNoteService {
  constructor(
    @InjectModel(StudentNote.name)
    private readonly studentNoteModel: Model<StudentNoteDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create(
    createStudentNoteDto: CreateStudentNoteDto,
  ): Promise<StudentNote> {
    await this.ensureStudentExists(createStudentNoteDto.studentId);
    return await new this.studentNoteModel(createStudentNoteDto).save();
  }

  async findAll(
    req: AuthenticatedRequest,
    studentId?: string,
  ): Promise<StudentNote[]> {
    const query: QueryFilter<StudentNoteDocument> = studentId
      ? { studentId }
      : {};

    if (req.user?.role === UserRole.PARENT) {
      query.parentId = req.user.id;
    }

    return await this.studentNoteModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(id: string): Promise<StudentNote> {
    const studentNote = await this.studentNoteModel.findOne({ id }).lean();
    if (!studentNote) {
      throw new NotFoundException('Student note not found');
    }
    return studentNote;
  }

  async update(
    id: string,
    updateStudentNoteDto: UpdateStudentNoteDto,
  ): Promise<StudentNote> {
    if (updateStudentNoteDto.studentId) {
      await this.ensureStudentExists(updateStudentNoteDto.studentId);
    }

    const studentNote = await this.studentNoteModel
      .findOneAndUpdate({ id }, updateStudentNoteDto, { new: true })
      .lean();
    if (!studentNote) {
      throw new NotFoundException('Student note not found');
    }
    return studentNote;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.studentNoteModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Student note not found');
    }
    return { message: 'Student note deleted successfully' };
  }

  private async ensureStudentExists(studentId: string): Promise<void> {
    const student = await this.studentModel.exists({ id: studentId });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
  }
}
