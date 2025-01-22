import mongoose from "mongoose";
import { env } from "./envLoad";

const databaseConn = async () => {
  const MONGO_URI = env.MONGO_URI || "";
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    throw new Error("Error to connect database");
  }
};

export default databaseConn;
