import express from "express";
import cors from "cors";
import { loadEnv } from "../../config/env";
import { connectDB } from "../../config/db";

loadEnv(); // load .env FIRST

const app = express();
app.use(cors());
app.use(express.json());

// simple test route
app.get("/", (req, res) => {
  res.send("Server Running");
});

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
