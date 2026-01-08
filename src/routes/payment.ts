import express from "express";
import {
  addInstalment,
  addPayment,
  editPayment,
  generateUrl,
  getAllPayment,
  getPaymentStudent,
} from "../controller/payment.controller";
import * as joi from "joi";
import { validationMiddleware } from "./validator/validator";

export interface ValidationEditPayment {
  isInstalment: boolean;
  anualFee: number;
  tuitionFee: number;
  registrationFee: number;
  uniformFee: number;
}

const editPaymentSchema = joi.object<ValidationEditPayment>({
  isInstalment: joi.boolean(),
  anualFee: joi.number(),
  tuitionFee: joi.number(),
  registrationFee: joi.number(),
  uniformFee: joi.number(),
});

export const payment = express.Router();

payment.post("/", addPayment);
payment.get("/", getAllPayment);
payment.get("/:noInduk", getPaymentStudent);
payment.put(
  "/:noInduk",
  validationMiddleware(editPaymentSchema, "body"),
  editPayment
);
payment.get("/generate/:noInduk", generateUrl);
payment.post("/instalment/:paymentId", addInstalment);
