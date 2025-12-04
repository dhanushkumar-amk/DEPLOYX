import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyForgotPasswordOtpSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";
import { validate } from "../../../middleware/validate";
import { requireAuth } from "../../../middleware/auth";

const router = Router();

router.post("/signup", validate(signupSchema), AuthController.signup);
router.post("/login", validate(loginSchema), AuthController.login);

router.post("/forgot-password", validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/verify-forgot-otp", validate(verifyForgotPasswordOtpSchema), AuthController.verifyForgotOtp);
router.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);

router.post("/logout", requireAuth, AuthController.logout);

export default router;
