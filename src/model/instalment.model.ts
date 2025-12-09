import { Schema, model } from "mongoose";
// import { v4 as uuidv4 } from "uuid";
import { uuid } from "../helper/generateUuid";

// const uuid = crypto.randomUUID();
export interface IInstalment {
  id: string;
  paymentId: string;
  paymentFee: number;
  createdDate: Date;
}

const instalmentSchema = new Schema<IInstalment>({
  id: {
    type: String,
    default: () => uuid(),
  },
  paymentId: String,
  paymentFee: Number,
  createdDate: {
    type: Date,
    default: new Date(),
  },
});

export const Instalment = model<IInstalment>("instalment", instalmentSchema);
