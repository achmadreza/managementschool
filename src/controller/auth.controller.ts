import { Request, Response } from "express";
import { IUser, User } from "../model/user.model";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  const { userName, password } = req.body;
  const salt = Number(process.env.SALT);
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ userName, password: hashedPassword });
    return res
      .status(201)
      .json({ message: "user berhasil ditambahkan", data: newUser });
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { userName, password } = req.body;
  const findUser: IUser | null = await User.findOne({ userName });
  if (!findUser) {
    return res.status(400).json({ message: "user tidak ditemukan" });
  }
  const isPassowd = await bcrypt.compare(password, findUser.password);
  if (!isPassowd) {
    return res.status(400).json({ message: "user / password salah" });
  }
  return res.json({
    message: "Login sukses",
    data: { userName, role: findUser.role },
  });
};
