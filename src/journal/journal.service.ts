import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import {
  Journal,
  JournalDocument,
  JournalStatus,
} from './schemas/journal.schema';
import { UserRole } from 'src/auth/enums/user-role.enum';
import { Student, StudentDocument } from 'src/student/schemas/student.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SendEmailPayload } from 'src/email/email.service';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

@Injectable()
export class JournalService {
  constructor(
    @InjectModel(Journal.name)
    private readonly journalModel: Model<JournalDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>, // Replace 'any' with the actual StudentDocument type if available
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createJournalDto: CreateJournalDto): Promise<Journal> {
    if (createJournalDto.status === JournalStatus.PUBLISHED) {
      const parent = await this.userModel
        .find({ role: UserRole.PARENT })
        .lean();

      const html = `
      <p>title: ${createJournalDto.title}</p>
      <p>${createJournalDto.message}</p>
      <p>silahkan kunjungi halaman berikut untuk informasi lebih lanjut.</p>
      <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a>
      `;
      parent?.length > 0 &&
        parent.forEach(async (p) => {
          await this.eventEmitter.emitAsync('email.send', {
            subject: 'Announcement',
            to: p.email ?? '',
            html,
          } as SendEmailPayload);
        });
    }
    return await new this.journalModel(createJournalDto).save();
  }

  async findAll(
    req: any,
    target?: string,
    status?: JournalStatus,
  ): Promise<Journal[]> {
    const query: QueryFilter<JournalDocument> = {};

    // if ((req.user?.role as UserRole) === UserRole.PARENT) {
    // const students = await this.studentModel
    //   .find({ parentId: req.user.id })
    //   .select({ class: 1 })
    //   .lean();
    // const studentClasses = [
    //   ...new Set(students.map((student) => student.class)),
    // ];

    // query.target = { $in: studentClasses };
    // query.status = JournalStatus.PUBLISHED;
    // } else
    if (target) {
      query.target = target;
    }

    if (status) {
      query.status = status;
    }

    return await this.journalModel.find(query).sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<Journal> {
    const journal = await this.journalModel.findOne({ id }).lean();
    if (!journal) {
      throw new NotFoundException('Journal not found');
    }
    return journal;
  }

  async update(
    id: string,
    updateJournalDto: UpdateJournalDto,
  ): Promise<Journal> {
    const journal = await this.journalModel
      .findOneAndUpdate({ id }, updateJournalDto, { new: true })
      .lean();

    if (!journal) {
      throw new NotFoundException('Journal not found');
    }
    return journal;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.journalModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Journal not found');
    }
    return { message: 'Journal deleted successfully' };
  }
}
