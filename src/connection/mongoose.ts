import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

//details from the env

//db connection
export const db = mongoose
  .connect(process.env.MONGO_URL ?? "")
  .then((res) => {
    if (res) {
      console.log(`Database connection succeffully to school`);
    }
  })
  .catch((err) => {
    // console.log(err);
  });
// export const AutoIncrement = Inc(mongoose);
