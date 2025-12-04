import { Request, Response } from "express";
import { buildConfigService } from "../services/buildConfig.service";

class BuildConfigController {

  async updateInstallCmd(req: Request, res: Response) {
    const { projectId } = req.params;
    const { installCmd } = req.body;

    const updated = await buildConfigService.updateInstallCmd(projectId, installCmd);
    res.json({ message: "Install command updated", updated });
  }

  async updateBuildCmd(req: Request, res: Response) {
    const { projectId } = req.params;
    const { buildCmd } = req.body;

    const updated = await buildConfigService.updateBuildCmd(projectId, buildCmd);
    res.json({ message: "Build command updated", updated });
  }

  async updateOutputDir(req: Request, res: Response) {
    const { projectId } = req.params;
    const { outputDir } = req.body;

    const updated = await buildConfigService.updateOutputDir(projectId, outputDir);
    res.json({ message: "Output directory updated", updated });
  }

  async updateRuntime(req: Request, res: Response) {
    const { projectId } = req.params;
    const { runtime } = req.body;

    const updated = await buildConfigService.updateRuntime(projectId, runtime);
    res.json({ message: "Runtime updated", updated });
  }

  async autoDetect(req: Request, res: Response) {
    const { projectId } = req.params;
    const pkgJson = req.body;

    const updated = await buildConfigService.autoDetectFramework(projectId, pkgJson);
    res.json({ message: "Framework auto-detected", updated });
  }

  async updateCloudProvider(req: Request, res: Response) {
    const { projectId } = req.params;
    const cloud = req.body;

    const updated = await buildConfigService.updateCloudProviderConfig(projectId, cloud);
    res.json({ message: "Cloud provider updated", updated });
  }
}

export const buildConfigController = new BuildConfigController();
