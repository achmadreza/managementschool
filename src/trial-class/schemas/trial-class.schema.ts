import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TrialClassDocument = HydratedDocument<TrialClass>;

export enum TrialClassStatus {
  WAITING_SCHEDULE = 'WAITING_SCHEDULE',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  APPROVED = 'APPROVED',
  RESCHEDULE = 'RESCHEDULE',
}

@Schema({ timestamps: true })
export class TrialClass {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  id!: string;

  @Prop({ required: true, trim: true })
  parentId!: string;

  @Prop({ required: true, trim: true })
  studentId!: string;

  @Prop({ required: true, trim: true })
  teacherId!: string;

  @Prop({ required: true })
  registeredAt!: Date;

  @Prop({
    required: true,
    enum: Object.values(TrialClassStatus),
    default: TrialClassStatus.WAITING_SCHEDULE,
  })
  status!: TrialClassStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

export const TrialClassSchema = SchemaFactory.createForClass(TrialClass);
