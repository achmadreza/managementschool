import app from "./app";
import { db } from "./connection/mongoose";
import dotEnv from "dotenv";
dotEnv.config();
const port = 3000;

db.then(() => {
  app.listen(port, () => {
    console.log("server running on ", port);
  });
});
