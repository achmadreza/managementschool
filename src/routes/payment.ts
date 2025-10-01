import express from "express";
import {
  addPayment,
  generateUrl,
  getAllPayment,
  getPaymentStudent,
} from "../controller/payment.controller";

export const payment = express.Router();

payment.post("/", addPayment);
payment.get("/", getAllPayment);
payment.get("/:noInduk", getPaymentStudent);
payment.get("/generate/:noInduk", generateUrl);
