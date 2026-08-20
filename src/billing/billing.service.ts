import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import {
  Billing,
  BillingDocument,
  BillingStatus,
} from './schemas/billing.schema';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { Student, StudentDocument } from 'src/student/schemas/student.schema';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Billing.name)
    private readonly billingModel: Model<BillingDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>, // Replace 'any' with the actual StudentDocument type if available
  ) {}

  async create(createBillingDto: CreateBillingDto): Promise<Billing> {
    try {
      const student = await this.studentModel
        .findOne({ id: createBillingDto.studentId })
        .lean();
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      const data = {
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString()}`,
        studentId: createBillingDto.studentId,
        studentName: student.name,
        studentClass: student.class,
        schoolCode: student.schoolCode,
        parentId: student.parentId,
        parentEmail: student.parentEmail,
        paymentList: createBillingDto.paymentList,
        dueDate: createBillingDto.dueDate,
        paidAt: createBillingDto.paidAt,
        description: createBillingDto.description,
        status: createBillingDto.status || BillingStatus.WAITING,
      };
      const billing = new this.billingModel(data);
      return await billing.save();
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
        throw new ConflictException(`Billing ${field} already exists`);
      }
      throw error;
    }
  }

  async findAll(
    q?: string,
    status?: BillingStatus,
    studentId?: string,
  ): Promise<Billing[]> {
    const query: QueryFilter<BillingDocument> = {};

    if (status) {
      query.status = status;
    }

    if (studentId) {
      query.studentId = studentId;
    }

    if (q && q.trim()) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      query.$or = [
        { invoiceNumber: regex },
        { studentId: regex },
        { schoolCode: regex },
        { studentName: { $regex: regex, $options: 'i' } },
      ];
    }

    return await this.billingModel.find(query).lean();
  }

  async findOne(id: string): Promise<Billing> {
    const billing = await this.billingModel.findOne({ id }).lean();
    if (!billing) {
      throw new NotFoundException('Billing not found');
    }
    return billing;
  }

  async update(
    id: string,
    updateBillingDto: UpdateBillingDto,
  ): Promise<Billing> {
    try {
      const billing = await this.billingModel
        .findOneAndUpdate(
          { id },
          { ...updateBillingDto, updatedAt: new Date() },
          { new: true },
        )
        .lean();
      if (!billing) {
        throw new NotFoundException('Billing not found');
      }
      return billing;
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
        throw new ConflictException(`Billing ${field} already exists`);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.billingModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Billing not found');
    }
    return { message: 'Billing deleted successfully' };
  }

  async updateStatus(id: string, status: BillingStatus): Promise<Billing> {
    const billing = await this.billingModel
      .findOneAndUpdate(
        { id },
        { status, updatedAt: new Date() },
        { new: true },
      )
      .lean();

    if (!billing) {
      throw new NotFoundException('Billing not found');
    }

    return billing;
  }
  async uploadBillingRecords(id: string, file: string): Promise<Billing> {
    if (!file || typeof file !== 'string') {
      throw new BadRequestException('A base64 payment file is required');
    }

    const base64 = file.replace(/^data:[^;]+;base64,/, '').trim();
    if (
      !base64 ||
      base64.length % 4 !== 0 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)
    ) {
      throw new BadRequestException('File must be a valid base64 string');
    }

    const billing = await this.billingModel
      .findOneAndUpdate(
        { id },
        { payment: file, updatedAt: new Date(), paidAt: new Date() },
        { new: true },
      )
      .lean();

    if (!billing) {
      throw new NotFoundException('Billing not found');
    }

    return billing;
  }
}
