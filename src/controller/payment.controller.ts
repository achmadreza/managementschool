import { Request, Response } from "express";
import { IPayment, Payment } from "../model/payment.model";
import { IStudent, Student } from "../model/student.model";

const generateUrlHelper = (noInduk: string, nama: string, noHp: string) => {
  const searchParams = {
    nomorInduk: noInduk,
    nama,
    noHp,
  };
  const jsonString = JSON.stringify(searchParams);
  const encodeBase64 = Buffer.from(jsonString).toString("base64");
  return `${process.env.URL_APP}/register?data=${encodeBase64}`;
};

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
    const studentPayment = await Payment.findOne({
      nomorInduk: Number(noInduk),
    });
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

export const addPayment = async (req: Request, res: Response) => {
  const {
    nama,
    noHp,
    anualFee,
    tuitionFee,
    registrationFee,
    uniformFee,
    paymentPhoto,
  } = req.body;
  let newStudent;
  try {
    newStudent = await Student.create({
      nama,
      noHp,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: "Gagal melakukan pembayaran", error: error.messge });
  }

  try {
    await Payment.create({
      anualFee,
      tuitionFee,
      nama: newStudent.nama,
      registrationFee,
      uniformFee,
      paymentPhoto,
      nomorInduk: newStudent.nomorInduk,
    });
    return res.status(201).json({
      message: "berhasil memasukan data siswa",
      url: generateUrlHelper(
        newStudent.nomorInduk.toString(),
        newStudent.nama,
        newStudent.noHp
      ),
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: "Gagal melakukan pembayaran", error: error.messge });
  }
};

export const generateUrl = async (req: Request, res: Response) => {
  const { noInduk } = req.params;
  const findStudent: IStudent | null = await Student.findOne({
    nomorInduk: noInduk,
  });
  if (!findStudent) {
    return res.status(400).json({
      message:
        "Maaf genetrate url gagal karena data pembayaran siswa tidak ditemukan",
    });
  }
  return res.status(200).json({
    message: "Berhasil generate url",
    url: generateUrlHelper(
      noInduk as string,
      findStudent.nama,
      findStudent.noHp
    ),
  });
};
