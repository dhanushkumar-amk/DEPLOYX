import { Router } from "express";
import authRoutes from "../models/auth/routes/auth.routes";
import testEmailRoutes from "./test-email";

export const router = Router();

// register all auth endpoints under /auth
router.use("/auth", authRoutes);
router.use("/test", testEmailRoutes);

router.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
