import mongoose from "mongoose";
import { logger } from "../../utils/logger";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ Missing MONGO_URI");
    return;
  }

  try {
    await mongoose.connect(uri);
    logger.info("✅ MongoDB Connected Successfully");
  } catch (err) {
    logger.error("❌ MongoDB Connection Failed:", err);
  }
};
