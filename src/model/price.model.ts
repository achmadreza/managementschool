import { Schema, model } from "mongoose";
// import { v4 as uuidv4 } from "uuid";
import { uuid } from "../helper/generateUuid";
import { Kelas } from "./student.model";

export interface IPrice {
  id?: string;
  anualFee: number;
  tuitionFee: number;
  registrationFee: number;
  uniformFee: number;
  kelas: Kelas;
}

const PriceSchema = new Schema<IPrice>({
  id: {
    type: String,
    default: uuid(),
  },
  kelas: {
    type: String,
    enum: Kelas,
    default: null,
  },
  anualFee: Number,
  tuitionFee: Number,
  registrationFee: Number,
  uniformFee: Number,
});

export const Price = model<IPrice>("price", PriceSchema);
