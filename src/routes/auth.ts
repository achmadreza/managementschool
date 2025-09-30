import express from "express";
import { login, register } from "../controller/auth.controller";

export const auth = express.Router();

auth.post("/login", login);

auth.post("/register", register);
