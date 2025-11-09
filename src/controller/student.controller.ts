import { Request, Response } from "express";
import { Student } from "../model/student.model";
import { Payment } from "../model/payment.model";
import { ValidationEditStudent } from "../routes/student";

// ambil data semua siswa
export const getAllStudent = async (req: Request, res: Response) => {
  // console.log(await Student.find({}));
  const { q } = req.query;

  try {
    let allStudent = await Student.find({});
    if (q) {
      allStudent = await Student.find({ nama: { $regex: q, $options: "i" } });
    }
    res.status(200).json({
      message: "Ambil data semua siswa sukses",
      data: allStudent,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "GagalMengambil data" });
  }
};

// amib detail siswa
export const detailStudent = async (req: Request, res: Response) => {
  const { noInduk } = req.params;
  try {
    const getDatailStudent = await Student.findOne({ nomorInduk: noInduk });

    if (!getDatailStudent) {
      return res.status(400).json({
        message: `Siswa dengan nomor induk (${noInduk}) tidak ditemukan`,
      });
    }

    res.status(200).json({
      message: "Ambil detail data siswa sukses",
      data: getDatailStudent,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: `Siswa dengan nomor induk (${noInduk}) tidak ditemukan`,
      error: error.message,
    });
  }
};

// edit status pembayaran
export const editStatusPayment = async (req: Request, res: Response) => {
  const { statusPembayaran } = req.body;

  const { noInduk } = req.params;
  const updateStatus = await Student.findOneAndUpdate(
    { nomorInduk: noInduk },
    { statusPembayaran }
  );
  if (!updateStatus) {
    return res.status(400).json({ message: "Siswa tidak ditemukan" });
  }
  return res.status(200).json({
    message: "Data pembayaran berhasil diupdate",
    data: { statusPembayaran },
  });
};

export const editStudent = async (req: Request, res: Response) => {
  const data: ValidationEditStudent = req.body;
  const { noInduk } = req.params;
  const updateStatus = await Student.findOneAndUpdate(
    { nomorInduk: noInduk },
    { ...data }
  );
  if (!updateStatus) {
    return res.status(400).json({ message: "Siswa tidak ditemukan" });
  }
  return res.status(200).json({
    message: "Data siswa berhasil diganti",
    data: { ...data },
  });
};

// registrasi siswa
export const addStudent = async (req: Request, res: Response) => {
  // console.log(req.body);
  let newStudent;
  const {
    // student
    nama,
    kelas,
    nomorInduk,
    tanggalLahir,
    namaAyah,
    namaIbu,
    tahunAjaran,
    noHp,
    // payment
    anualFee,
    tuitionFee,
    registrationFee,
    uniformFee,
    paymentPhoto,
  } = req.body;
  try {
    newStudent = await Student.create({
      nama,
      kelas,
      nomorInduk,
      tanggalLahir,
      namaAyah,
      namaIbu,
      tahunAjaran,
      noHp,
    });
    res.status(201).json({
      message: "Tambah siswa sukses",
      data: newStudent,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: "Gagal menambah siswa", error: error.message });
  }

  // try {
  //   Payment.create({
  //     nomorInduk: newStudent.nomorInduk,
  //     anualFee,
  //     tuitionFee,
  //     registrationFee,
  //     uniformFee,
  //     paymentPhoto,
  //   });
  //   res.status(201).json({
  //     message: "Tambah siswa sukses",
  //     data: newStudent,
  //   });
  // } catch (error: any) {
  //   return res
  //     .status(400)
  //     .json({ message: "Gagal menambah siswa", error: error.message });
  // }
};
