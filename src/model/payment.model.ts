import { Schema, model } from "mongoose";
// import { v4 as uuidv4 } from "uuid";
import { uuid } from "../helper/generateUuid";

// const uuid = crypto.randomUUID();
export interface IPayment {
  id: string;
  nomorInduk: number;
  anualFee: number;
  tuitionFee: number;
  registrationFee: number;
  uniformFee: number;
  paymentPhoto: string;
  createdDate: Date;
}

const paymentSchema = new Schema<IPayment>({
  id: {
    type: String,
    default: uuid(),
  },
  nomorInduk: {
    type: Number,
    required: true,
  },
  anualFee: Number,
  tuitionFee: Number,
  registrationFee: Number,
  uniformFee: Number,
  paymentPhoto: String,
  createdDate: {
    type: Date,
    default: new Date(),
  },
});

export const Payment = model<IPayment>("payments", paymentSchema);
