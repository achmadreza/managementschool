import app from "./app";
import { db } from "./connection/mongoose";
import dotEnv from "dotenv";
const port = 3000;

dotEnv.config();
db.then(() => {
  app.listen(port, () => {
    console.log("server running on ", port);
  });
});
