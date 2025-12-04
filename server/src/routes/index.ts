import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes";
import userRoutes from "../modules/user/routes/user.routes";

export const router = Router();

// register all auth endpoints under /auth
router.use("/auth", authRoutes);
router.use("/user", userRoutes);

router.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
