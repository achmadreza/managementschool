import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  id!: string;

  @Prop({ required: false, trim: true })
  title!: string;

  @Prop({ required: false, trim: true })
  file!: string;

  @Prop({ required: false, trim: true, default: null })
  description?: string | null;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
