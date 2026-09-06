import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentNoteDocument = HydratedDocument<StudentNote>;

export enum StudentNoteCategory {
  PROGRESS = 'PROGRESS',
  ATTITUDE = 'ATTITUDE',
  SOCIAL = 'SOCIAL',
  HEALTH = 'HEALTH',
  INFORMATION = 'INFORMATION',
}

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class StudentNote {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  id!: string;

  @Prop({ required: true, trim: true, index: true })
  studentId!: string;

  @Prop({ required: true, trim: true, index: true })
  parentId!: string;

  @Prop({ type: String, enum: StudentNoteCategory, required: true, trim: true })
  category!: StudentNoteCategory;

  @Prop({ required: true, trim: true })
  notedAt!: Date;

  @Prop({ type: Number, required: true, trim: true, default: 0 })
  indicator!: number;

  @Prop({ required: false, trim: true })
  title!: string;

  @Prop({ required: false, trim: true })
  description!: string;

  @Prop({ type: String, default: null, trim: true })
  photo!: string | null;

  @Prop({ type: String, default: null, trim: true })
  suggestion!: string | null;

  @Prop({ type: String, default: null, trim: true })
  attention!: string | null;

  @Prop({ type: String, default: null, trim: true })
  followUp!: string | null;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;

  @Prop({ type: Date })
  updatedAt!: Date;
}

export const StudentNoteSchema = SchemaFactory.createForClass(StudentNote);
