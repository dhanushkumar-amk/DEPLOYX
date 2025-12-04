import { Router } from "express";
import { buildConfigController } from "../controllers/buildConfig.controller";

const router = Router();

router.post("/:projectId/install", buildConfigController.updateInstallCmd.bind(buildConfigController));
router.post("/:projectId/build", buildConfigController.updateBuildCmd.bind(buildConfigController));
router.post("/:projectId/output", buildConfigController.updateOutputDir.bind(buildConfigController));
router.post("/:projectId/runtime", buildConfigController.updateRuntime.bind(buildConfigController));

// Auto detect via package.json
router.post("/:projectId/auto-detect", buildConfigController.autoDetect.bind(buildConfigController));

// Cloud provider config
router.post("/:projectId/cloud", buildConfigController.updateCloudProvider.bind(buildConfigController));

export default router;
