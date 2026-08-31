import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media, MediaDocument } from './schemas/media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    return await new this.mediaModel(createMediaDto).save();
  }

  async findAll(q?: string): Promise<Media[]> {
    const query: QueryFilter<MediaDocument> = {};

    if (q?.trim()) {
      const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.title = { $regex: escaped, $options: 'i' };
    }

    return await this.mediaModel.find(query).sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<Media> {
    const media = await this.mediaModel.findOne({ id }).lean();
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    return media;
  }

  async update(id: string, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const media = await this.mediaModel
      .findOneAndUpdate({ id }, updateMediaDto, { new: true })
      .lean();
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    return media;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.mediaModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Media not found');
    }
    return { message: 'Media deleted successfully' };
  }
}
