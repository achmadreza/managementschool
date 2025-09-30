import mongoose, { Document, Schema, model } from "mongoose";
import { uuid } from "../helper/generateUuid";

export interface IUser {
  id: string;
  userName: string;
  password: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  id: {
    type: String,
    default: uuid(),
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "ADMIN",
  },
});

export const User = model("users", userSchema);
