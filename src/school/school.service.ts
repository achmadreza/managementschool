import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School, SchoolDocument } from './schemas/school.schema';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name)
    private readonly schoolModel: Model<SchoolDocument>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    try {
      const school = new this.schoolModel(createSchoolDto);
      return await school.save();
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
        throw new ConflictException(`School ${field} already exists`);
      }
      throw error;
    }
  }

  async findAll(id?: string, code?: string): Promise<School[]> {
    const query: Record<string, string> = {};
    if (id) query.id = id;
    if (code) query.code = code;
    return await this.schoolModel.find(query).lean();
  }

  async findOne(id: string): Promise<School> {
    const school = await this.schoolModel.findOne({ id }).lean();
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }

  async findByCode(code: string): Promise<School> {
    const school = await this.schoolModel.findOne({ code }).lean();
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    try {
      const school = await this.schoolModel
        .findOneAndUpdate({ id }, updateSchoolDto, { new: true })
        .lean();
      if (!school) {
        throw new NotFoundException('School not found');
      }
      return school;
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
        throw new ConflictException(`School ${field} already exists`);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.schoolModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('School not found');
    }
    return { message: 'School deleted successfully' };
  }
}
