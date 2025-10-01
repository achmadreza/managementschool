import mongoose, { Document, Schema, model } from "mongoose";
import { uuid } from "../helper/generateUuid";
import Inc from "mongoose-sequence";

const AutoIncrement = Inc(mongoose as any);

export enum StatusPayment {
  LUNAS = "LUNAS",
  BELUM_LUNAS = "BELUM LUNAS",
}

export enum Kelas {
  TKA = "TK A",
  TKB = "TK B",
}
export interface IStudent extends Document {
  id: string;
  nama: string;
  kelas: Kelas;
  nomorInduk: number;
  tanggalLahir: Date;
  namaAyah: string;
  namaIbu: string;
  tahunAjaran: number;
  noHp: string;
  statusPembayaran: StatusPayment;
  createdDate: Date;
}

const studentSchema = new Schema<IStudent>({
  id: {
    type: String,
    default: uuid(),
  },
  kelas: {
    type: String,
    enum: Kelas,
  },
  nama: {
    type: String,
    required: true,
  },
  namaAyah: {
    type: String,
    // required: true,
  },
  namaIbu: {
    type: String,
    // required: true,
  },
  noHp: {
    type: String,
    // required: true,
  },
  nomorInduk: {
    type: Number,
    // required: true,
    unique: true,
  },
  tahunAjaran: Number,
  tanggalLahir: Date,
  statusPembayaran: {
    type: String,
    enum: StatusPayment,
    default: StatusPayment.BELUM_LUNAS,
  },
  createdDate: {
    type: Date,
    default: new Date(),
  },
});

studentSchema.plugin(AutoIncrement as any, {
  start_seq: 2025021,
  inc_field: "nomorInduk",
});
export const Student = model<IStudent>("students", studentSchema);
