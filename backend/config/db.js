import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(()=> console.log("DB connected"));
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
}
