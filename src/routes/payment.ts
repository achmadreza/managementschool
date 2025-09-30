import express from "express";
import {
  getAllPayment,
  getPaymentStudent,
} from "../controller/payment.controller";

export const payment = express.Router();

payment.get("/", getAllPayment);
payment.get("/:noInduk", getPaymentStudent);
