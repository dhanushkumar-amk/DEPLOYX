import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes";
import userRoutes from "../modules/user/routes/user.routes";
import projectRoutes from "../modules/project/routes/project.routes";
import environmentRoutes from "../modules/project/routes/environment.routes";
import buildConfigRoutes from "../modules/project/routes/buildConfig.routes";


export const router = Router();

// register all auth endpoints under /auth
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/projects", projectRoutes);
router.use("/env", environmentRoutes);
router.use("/build", buildConfigRoutes);

router.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
