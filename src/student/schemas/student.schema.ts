import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  id!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  class!: string;

  @Prop({ required: true, trim: true })
  gender!: string;

  @Prop({ required: true, trim: true })
  address!: string;

  @Prop({ required: true })
  birthdate!: Date;

  @Prop({ required: true, trim: true })
  fatherName!: string;

  @Prop({ required: true, trim: true })
  motherName!: string;

  @Prop({ required: true, trim: true })
  emailParent!: string;

  @Prop({ required: true, trim: true })
  phoneNumber!: string;

  @Prop({ required: true, trim: true })
  schoolYear!: string;

  @Prop({ required: true, trim: true })
  kk!: string;

  @Prop({ required: true, trim: true })
  birthCertificate!: string;

  @Prop({ required: true, trim: true })
  photo!: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
