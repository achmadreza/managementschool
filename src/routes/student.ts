import express, { NextFunction, Request, Response } from "express";
import {
  addStudent,
  detailStudent,
  editStatusPayment,
  editStudent,
  getAllStudent,
} from "../controller/student.controller";
import Joi from "joi";

import { Kelas, StatusPayment } from "../model/student.model";
import { validationMiddleware } from "./validator/validator";

interface ValidationEditPaymentStatus {
  statusPembayaran: StatusPayment;
}

export interface ValidationEditStudent {
  nama: string;
  kelas: Kelas;
  tanggalLahir: Date;
  namaAyah: string;
  namaIbu: string;
  tahunAjaran: number;
  noHp: string;
}

export const student = express.Router();

const editStatusPaymentSchema = Joi.object<ValidationEditPaymentStatus>({
  statusPembayaran: Joi.string().valid(...Object.values(StatusPayment)),
});

const editStudentSchema = Joi.object<ValidationEditStudent>({
  nama: Joi.string().min(1),
  kelas: Joi.string().valid(...Object.values(Kelas)),
  namaAyah: Joi.string().min(1),
  namaIbu: Joi.string().min(1),
  noHp: Joi.string().min(3),
  tahunAjaran: Joi.number().required(),
  tanggalLahir: Joi.date(),
});

student.get("/", getAllStudent);
// student.post("/", addStudent);
student.get("/:noInduk", detailStudent);
student.put(
  "/:noInduk",
  validationMiddleware(editStudentSchema, "body"),
  editStudent
);
student.put(
  "/payment/:noInduk",
  validationMiddleware(editStatusPaymentSchema, "body"),
  editStatusPayment
);
