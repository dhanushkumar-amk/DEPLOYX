import express from "express";
import cors from "cors";

import { loadEnv } from "../../config/env";
loadEnv();

import { connectDB } from "../../config/db";
import { requestLogger } from "../../middleware/logger";
import { router } from "../../routes";
import { logger } from "../../utils/logger";



import { redis } from "../../config/redis";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// register all routes (includes /auth/*)
app.use("/api", router);

// fallback error handler
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(`Server Error: ${err.message}`);
  return res.status(500).json({ error: "Internal Server Error" });
});

// start server
const startServer = async () => {
  try {
     logger.info(" 🕛 Connecting to  mongoDB...");
    await connectDB();


    logger.info(" 🕛 Connecting to Upstash Redis...");
    await redis.ping();
    logger.info("Redis Connected 🔴");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} 🚀`);
    });
  } catch (err: any) {
    logger.error("Startup error: " + err.message);
    process.exit(1);
  }
};

startServer();
