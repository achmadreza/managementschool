import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Student, StudentDocument } from '../student/schemas/student.schema';
import { CreateTrialClassDto } from './dto/create-trial-class.dto';
import { UpdateTrialClassDto } from './dto/update-trial-class.dto';
import {
  TrialClass,
  TrialClassDocument,
  TrialClassStatus,
} from './schemas/trial-class.schema';

@Injectable()
export class TrialClassService {
  constructor(
    @InjectModel(TrialClass.name)
    private readonly trialClassModel: Model<TrialClassDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create(createTrialClassDto: CreateTrialClassDto): Promise<TrialClass> {
    const existingRegistration = await this.trialClassModel
      .findOne({
        parentId: createTrialClassDto.parentId.trim(),
        studentId: createTrialClassDto.studentId.trim(),
      })
      .lean();

    if (existingRegistration) {
      throw new ConflictException('Trial class registration already exists');
    }

    return await new this.trialClassModel(createTrialClassDto).save();
  }

  async findAll(
    q?: string,
    status?: TrialClassStatus,
  ): Promise<(TrialClass & { student: Student | null })[]> {
    const query: QueryFilter<TrialClassDocument> = {};

    if (q?.trim()) {
      const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      query.$or = [{ parentId: regex }, { studentId: regex }];
    }

    if (status) {
      query.status = status;
    }

    const trialClasses = await this.trialClassModel
      .find(query)
      .sort({ registeredAt: -1 })
      .lean();

    const studentIds = [
      ...new Set(trialClasses.map(({ studentId }) => studentId)),
    ];
    const students = await this.studentModel
      .find({ id: { $in: studentIds } })
      .lean();
    const studentsById = new Map(
      students.map((student) => [student.id, student]),
    );

    return trialClasses.map((trialClass) => ({
      ...trialClass,
      student: studentsById.get(trialClass.studentId) ?? null,
    }));
  }

  async findOne(id: string): Promise<TrialClass> {
    const trialClass = await this.trialClassModel.findOne({ id }).lean();
    if (!trialClass) {
      throw new NotFoundException('Trial class registration not found');
    }
    return trialClass;
  }

  async update(
    id: string,
    updateTrialClassDto: UpdateTrialClassDto,
  ): Promise<TrialClass> {
    const trialClass = await this.trialClassModel
      .findOneAndUpdate({ id }, updateTrialClassDto, { new: true })
      .lean();
    if (!trialClass) {
      throw new NotFoundException('Trial class registration not found');
    }
    return trialClass;
  }

  async updateStatus(
    id: string,
    status: TrialClassStatus,
  ): Promise<TrialClass> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.trialClassModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Trial class registration not found');
    }
    return { message: 'Trial class registration deleted successfully' };
  }
}
