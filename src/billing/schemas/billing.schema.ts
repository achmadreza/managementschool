import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

export type BillingDocument = HydratedDocument<Billing>;

export enum BillingStatus {
  WAITING = 'WAITING',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
  //   OVERDUE = 'OVERDUE',
}

@Schema({ timestamps: true })
export class Billing {
  @Prop({ required: true, unique: true, default: () => randomUUID() })
  id!: string;

  @Prop({ required: true, unique: true, trim: true })
  invoiceNumber!: string;

  @Prop({ required: true, trim: true })
  studentId!: string;

  @Prop({ required: false, trim: true, default: null })
  studentName?: string;

  @Prop({ required: false, trim: true, default: null })
  studentClass?: string;

  @Prop({ required: false, trim: true, default: null })
  schoolCode?: string;

  @Prop({ required: false, trim: true, default: null })
  parentId?: string;

  @Prop({ required: false, trim: true, default: null })
  parentEmail?: string;

  @Prop({ required: false, trim: true, default: null })
  description?: string;

  //   @Prop({ required: true, min: 0 })
  //   amount!: number;

  @Prop({ type: [{ paymentType: String, amount: Number }], required: true })
  paymentList!: {
    paymentType: string;
    amount: number;
  }[];

  @Prop({ required: true })
  dueDate!: Date;

  @Prop({
    required: true,
    enum: Object.values(BillingStatus),
    default: BillingStatus.WAITING,
  })
  status!: BillingStatus;

  @Prop({ required: false, default: null })
  paidAt?: Date;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;

  @Prop({ type: String, default: null, required: false })
  payment!: string;
}

export const BillingSchema = SchemaFactory.createForClass(Billing);
