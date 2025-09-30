import { Request, Response } from "express";
import { Payment } from "../model/payment.model";

export const getAllPayment = async (req: Request, res: Response) => {
  // console.log(await Student.find({}));
  try {
    const allPayment = await Payment.find({});
    res.status(200).json({
      message: "Ambil data semua pembayaran sukses",
      data: allPayment,
    });
  } catch (error: any) {
    console.log(error.messge);
    return res
      .status(400)
      .json({ message: "GagalMengambil data", error: error.messge });
  }
};

export const getPaymentStudent = async (req: Request, res: Response) => {
  // console.log(await Student.find({}));
  const { noInduk } = req.params;
  try {
    const studentPayment = await Payment.find({ nomor_induk: Number(noInduk) });
    res.status(200).json({
      message: "Ambil data pembayaran sukses",
      data: studentPayment,
    });
  } catch (error: any) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Data tidak ditemukan", error: error.message });
  }
};
