import { Request, Response } from "express";
import { IPayment, Payment } from "../model/payment.model";
import { IStudent, StatusPayment, Student } from "../model/student.model";
import { Instalment } from "../model/instalment.model";
import { Price } from "../model/price.model";

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
  const { q } = req.query;
  try {
    let allPayment = await Payment.find({});
    if (q) {
      allPayment = await Payment.find({ nama: { $regex: q, $options: "i" } });
    }
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
    const studentPayment = await Payment.aggregate([
      {
        $match: { nomorInduk: Number(noInduk) },
      },
      {
        $lookup: {
          from: "instalments",
          localField: "id",
          foreignField: "paymentId",
          as: "instalment",
        },
      },
    ]);
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
    isInstalment,
    paymentFee,
  } = req.body;
  let newStudent;
  try {
    newStudent = await Student.create({
      nama,
      noHp,
      statusPembayaran: isInstalment
        ? StatusPayment.BELUM_LUNAS
        : StatusPayment.LUNAS,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: "Gagal melakukan pembayaran", error: error.messge });
  }
  let newPayment;
  try {
    newPayment = await Payment.create({
      anualFee,
      tuitionFee,
      nama: newStudent.nama,
      registrationFee,
      uniformFee,
      paymentPhoto,
      nomorInduk: newStudent.nomorInduk,
    });

    if (isInstalment) {
      await Instalment.create({
        paymentId: newPayment.id,
        paymentFee,
      });
    }

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

export const addInstalment = async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const { paymentFee } = req.body;

  try {
    const newInstalment = await Instalment.create({
      paymentFee,
      paymentId,
    });

    const payment = await Payment.findOne({ id: paymentId });
    const student = await Student.findOne({ nomorInduk: payment?.nomorInduk });
    const instalment = await Instalment.find({ paymentId });
    const price = await Price.findOne({ kelas: student?.kelas });
    let total;
    if (price) {
      total =
        price.registrationFee +
        price.tuitionFee +
        price.anualFee +
        price.uniformFee;
    }
    const totalInstalment = instalment.reduce(
      (acc, curr) => acc + curr.paymentFee,
      0
    );

    console.log(total, totalInstalment);
    if (total && total >= totalInstalment) {
      await Student.findOneAndUpdate(
        { nomorInduk: student?.nomorInduk },
        { statusPembayaran: StatusPayment.LUNAS }
      );
    }

    return res.status(200).json({
      message: "Sukses menambahkan instalment",
      data: newInstalment,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: "Gagal melakukan pembayaran", error: error.messge });
  }
};
