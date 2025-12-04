import { Router } from "express";
import { environmentController } from "../controllers/environment.controller";

const router = Router();

// GET environment config
router.get("/:projectId/:env", environmentController.getEnv.bind(environmentController));

// ENV VARS
router.post("/:projectId/:env/vars", environmentController.addVar.bind(environmentController));
router.delete("/:projectId/:env/vars/:key", environmentController.deleteVar.bind(environmentController));

// SECRETS
router.post("/:projectId/:env/secrets", environmentController.addSecret.bind(environmentController));
router.delete("/:projectId/:env/secrets/:key", environmentController.deleteSecret.bind(environmentController));

export default router;
