import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

export type StudentDocument = HydratedDocument<Student>;

export enum StudentStatus {
  PROCESS = 'PROCESS',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  id!: string;

  @Prop({ type: String, default: null })
  schoolCode?: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  class!: string;

  @Prop({ required: true, trim: true })
  gender!: string;

  // @Prop({ required: true, trim: true })
  // religion!: string;

  @Prop({
    required: true,
    enum: Object.values(StudentStatus),
    default: StudentStatus.PROCESS,
    trim: true,
  })
  status!: StudentStatus;

  @Prop({ required: true, trim: true })
  address!: string;

  @Prop({ required: true, trim: true })
  birthPlace!: string;

  @Prop({ required: true })
  birthdate!: Date;

  // @Prop({ required: true, trim: true })
  // prevSchool!: string;

  // @Prop({ required: true, trim: true })
  // fatherName!: string;

  // @Prop({ required: true, trim: true })
  // fatherPhoneNumber!: string;

  // @Prop({ required: true, trim: true })
  // motherName!: string;

  // @Prop({ required: true, trim: true })
  // motherPhoneNumber!: string;
  @Prop({ required: false, trim: true })
  parentId!: string;

  @Prop({ required: true, trim: true })
  parentEmail!: string;

  @Prop({ required: false, trim: true })
  parentName!: string;

  @Prop({ required: true, trim: true })
  phoneNumber!: string;

  @Prop({ required: true, trim: true })
  emergencyContact!: string;

  @Prop({ required: true, trim: true })
  schoolYear!: string;

  @Prop({ required: true, trim: true })
  kk!: string;

  @Prop({ required: true, trim: true })
  birthCertificate!: string;

  @Prop({ required: true, trim: true })
  photo!: string;

  createdAt!: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
