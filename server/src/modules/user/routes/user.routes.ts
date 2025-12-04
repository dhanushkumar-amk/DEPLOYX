import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../../../middleware/validate";
import { requireAuth } from "../../../middleware/auth";
import { updateProfileSchema, changePasswordSchema } from "../validators/user.validator";
import { upload } from "../utils/multer";

const router = Router();

router.get("/me", requireAuth, UserController.me);
router.put("/update", requireAuth, validate(updateProfileSchema), UserController.update);
router.put("/change-password", requireAuth, validate(changePasswordSchema), UserController.changePassword);

router.post(
  "/avatar",
  requireAuth,
  upload.single("avatar"),
  UserController.uploadAvatar
);

export default router;
