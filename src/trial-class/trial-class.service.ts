import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Student, StudentDocument } from '../student/schemas/student.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateTrialClassDto } from './dto/create-trial-class.dto';
import { UpdateTrialClassDto } from './dto/update-trial-class.dto';
import {
  TrialClass,
  TrialClassDocument,
  TrialClassStatus,
} from './schemas/trial-class.schema';
import { UserRole } from 'src/auth/enums/user-role.enum';

@Injectable()
export class TrialClassService {
  constructor(
    @InjectModel(TrialClass.name)
    private readonly trialClassModel: Model<TrialClassDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
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
    req: any,
    q?: string,
    status?: TrialClassStatus,
  ): Promise<
    (TrialClass & {
      student: Student | null;
      teacher: Pick<
        User,
        'id' | 'fullName' | 'email' | 'phone' | 'schoolCode' | 'role'
      > | null;
    })[]
  > {
    const query: QueryFilter<TrialClassDocument> = {};

    if (q?.trim()) {
      const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      query.$or = [{ parentId: regex }, { studentId: regex }];
    }

    if (req.user?.role === UserRole.PARENT) {
      query.parentId = req.user?.id;
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

    const teacherIds = [
      ...new Set(trialClasses.map(({ teacherId }) => teacherId)),
    ];
    const teachers = await this.userModel
      .find({ id: { $in: teacherIds } })
      .select('id fullName email phone schoolCode role')
      .lean();
    const teachersById = new Map(
      teachers.map((teacher) => [teacher.id, teacher]),
    );

    return trialClasses.map((trialClass) => ({
      ...trialClass,
      student: studentsById.get(trialClass.studentId) ?? null,
      teacher: teachersById.get(trialClass.teacherId) ?? null,
    }));
  }

  async findOne(
    req: any,
    id: string,
  ): Promise<
    TrialClass & {
      student: Student | null;
      teacher: Pick<
        User,
        'id' | 'fullName' | 'email' | 'phone' | 'schoolCode' | 'role'
      > | null;
    }
  > {
    const query: QueryFilter<TrialClassDocument> = { id };
    if (req.user?.role === UserRole.PARENT) {
      query.parentId = req.user?.id;
    }
    const trialClass = await this.trialClassModel.findOne(query).lean();
    if (!trialClass) {
      throw new NotFoundException('Trial class registration not found');
    }

    const [student, teacher] = await Promise.all([
      this.studentModel.findOne({ id: trialClass.studentId }).lean(),
      this.userModel
        .findOne({ id: trialClass.teacherId })
        .select('id fullName email phone schoolCode role')
        .lean(),
    ]);

    return {
      ...trialClass,
      student: student ?? null,
      teacher: teacher ?? null,
    };
  }

  async update(
    id: string,
    updateTrialClassDto: Partial<UpdateTrialClassDto>,
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
