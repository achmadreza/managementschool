import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JournalDocument = HydratedDocument<Journal>;

export enum JournalStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@Schema({ timestamps: true })
export class Journal {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  id!: string;

  @Prop({ type: String, default: null, trim: true })
  target!: string | null;

  @Prop({ type: String, enum: JournalStatus, required: true, trim: true })
  status!: JournalStatus;

  @Prop({ type: String, trim: true, default: null })
  title!: string;

  @Prop({ type: String, trim: true, default: null })
  message!: string;

  @Prop({ type: String, default: null, trim: true })
  file!: string | null;

  @Prop({ type: String, default: null, trim: true })
  photo!: string | null;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
