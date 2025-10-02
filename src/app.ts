import express, { Request, Response } from "express";
import { student } from "./routes/student";
// import { json } from "body-parser";
import cors from "cors";
import { payment } from "./routes/payment";
import { auth } from "./routes/auth";
import { Counter } from "./model/counter.model";
const app = express();

app.use(express.json());
app.use(cors());
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

app.use("/student", student);
app.use("/payment", payment);
app.use("/auth", auth);

export default app;
