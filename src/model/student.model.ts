import mongoose, { Document, Schema, model } from "mongoose";
import { uuid } from "../helper/generateUuid";
import Inc from "mongoose-sequence";

const AutoIncrement = Inc(mongoose as any);

export enum StatusPayment {
  LUNAS = "LUNAS",
  BELUM_LUNAS = "BELUM LUNAS",
}

export enum Kelas {
  KINDERGARTENA = "KINDERGARTEN A",
  KINDERGARTENB = "KINDERGARTEN B",
  PRESCHOOL = "PRESCHOOL",
}

export enum Gender {
  LAKI_LAKI = "LAKI-LAKI",
  PEREMPUAN = "PEREMPUAN",
}
export interface IStudent extends Document {
  id: string;
  nama: string;
  kelas: Kelas;
  nomorInduk: number;
  tanggalLahir: Date;
  namaAyah: string;
  namaIbu: string;
  tahunAjaran: string;
  noHp: string;
  statusPembayaran: StatusPayment;
  createdDate: Date;
  gender: Gender;
  pasPhoto: string;
  kk: string;
  akteLahir: string;
  alamat: string;
}

const studentSchema = new Schema<IStudent>({
  id: {
    type: String,
    default: uuid(),
  },
  kelas: {
    type: String,
    enum: Kelas,
    default: null,
  },
  nama: {
    type: String,
    required: true,
  },
  namaAyah: {
    type: String,
    default: null,
    // required: true,
  },
  namaIbu: {
    type: String,
    // required: true,
    default: null,
  },
  noHp: {
    type: String,
    // required: true,
    default: null,
  },
  nomorInduk: {
    type: Number,
    // required: true,
    unique: true,
  },
  tahunAjaran: {
    type: String,
    default: new Date().getFullYear(),
  },
  tanggalLahir: {
    type: Date,
    default: null,
  },
  statusPembayaran: {
    type: String,
    enum: StatusPayment,
    default: StatusPayment.BELUM_LUNAS,
  },
  createdDate: {
    type: Date,
    default: new Date(),
  },
  gender: {
    type: String,
    enum: Gender,
    default: null,
  },
  pasPhoto: {
    type: String,
    default: null,
  },
  akteLahir: {
    type: String,
    default: null,
  },
  kk: {
    type: String,
    default: null,
  },
  alamat: {
    type: String,
    default: null,
  },
});

studentSchema.plugin(AutoIncrement as any, {
  start_seq: 2025021,
  inc_field: "nomorInduk",
});
export const Student = model<IStudent>("students", studentSchema);
