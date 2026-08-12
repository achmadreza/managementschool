import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Request } from 'express';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentStatus } from './schemas/student.schema';
import { UserRole } from 'src/auth/enums/user-role.enum';

interface RequestWithUser extends Request {
  user?: {
    id?: string;
    role?: UserRole;
  };
}

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const getStudent = await this.studentModel
        .findOne({
          parentId: createStudentDto.parentId,
          name: createStudentDto.name.trim(),
        })
        .lean();
      if (getStudent) {
        throw new ConflictException('Student already exists');
      }

      const student = new this.studentModel({
        ...createStudentDto,
        createdAt: new Date(),
      });
      return await student.save();
    } catch (error: unknown) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const err = error as Record<string, unknown>;
      if (err?.code === 11000) {
        const keyPattern = (err.keyPattern as Record<string, unknown>) || {};
        const field = Object.keys(keyPattern)[0] || 'field';
        throw new ConflictException(`Student ${field} already exists`);
      }
      throw error;
    }
  }

  async findAll(req: RequestWithUser, q?: string): Promise<Student[]> {
    const query: QueryFilter<StudentDocument> = {};
    if (q && q.trim()) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      query.$or = [{ name: regex }, { id: regex }, { class: regex }];
    }
    if ((req.user?.role as UserRole) === UserRole.PARENT) {
      query.parentId = req.user?.id;
    }
    return await this.studentModel.find(query).lean();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findOne({ id }).lean();
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    try {
      const student = await this.studentModel
        .findOneAndUpdate({ id }, updateStudentDto, { new: true })
        .lean();
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      return student;
    } catch (error: unknown) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const err = error as Record<string, unknown>;
      if (err?.code === 11000) {
        const keyPattern = (err.keyPattern as Record<string, unknown>) || {};
        const field = Object.keys(keyPattern)[0] || 'field';
        throw new ConflictException(`Student ${field} already exists`);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.studentModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Student not found');
    }
    return { message: 'Student deleted successfully' };
  }

  async updateStatus(id: string, status: StudentStatus): Promise<Student> {
    const student = await this.studentModel
      .findOneAndUpdate({ id }, { status }, { new: true })
      .lean();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }
}
