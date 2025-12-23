import express, { Request, Response } from "express";
import { student } from "./routes/student";
// import { json } from "body-parser";
import cors from "cors";
import { payment } from "./routes/payment";
import { auth } from "./routes/auth";
import { Counter } from "./model/counter.model";
import { downloadPayment } from "./controller/payment.controller";
import dotEnv from "dotenv";
dotEnv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: process.env.URL_APP ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.raw());
app.use(express.urlencoded());
app.get("/", async (req: Request, res: Response) => {
  const counter = await Counter.find({});
  res.json({ data: counter });
  return;
});

app.post("/", (req: Request, res: Response) => {
  res.json(req.body);
  return;
});

app.get("/download/payment", downloadPayment);
app.use("/student", student);
app.use("/payment", payment);
app.use("/auth", auth);

export default app;
