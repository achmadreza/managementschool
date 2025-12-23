import { db } from "../connection/mongoose";
import { IPrice, Price } from "../model/price.model";
import { Kelas } from "../model/student.model";
import mongoose from "mongoose";
const price: IPrice[] = [
  {
    anualFee: 3500000,
    registrationFee: 4500000,
    tuitionFee: 800000,
    uniformFee: 470000,
    kelas: Kelas.PRESCHOOL,
  },
  {
    anualFee: 3500000,
    registrationFee: 5500000,
    tuitionFee: 900000,
    uniformFee: 570000,
    kelas: Kelas.KINDERGARTENA,
  },
  {
    anualFee: 3500000,
    registrationFee: 7500000,
    tuitionFee: 900000,
    uniformFee: 570000,
    kelas: Kelas.KINDERGARTENA,
  },
];

const addPrice = async () => {
  try {
    price.map(async (p) => {
      const { anualFee, kelas, registrationFee, tuitionFee, uniformFee } = p;
      await Price.create({
        anualFee,
        kelas,
        registrationFee,
        tuitionFee,
        uniformFee,
      });
    });
  } catch (e: any) {
    console.log(e.message);
  }
};
db.then(() => {
  addPrice();
});
// mongoose.disconnect();
