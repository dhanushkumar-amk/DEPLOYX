import express from "express";
import cors from "cors";
import { loadEnv } from "../../config/env";
import { connectDB } from "../../config/db";
import { requestLogger } from "../../middleware/logger";
import { logger } from "../../utils/logger";

loadEnv();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// routes
app.get("/", (req, res) => {
  res.send("Server Running");
});

// start server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => logger.info(`✅ Server running on port ${PORT}`));
};

startServer();
