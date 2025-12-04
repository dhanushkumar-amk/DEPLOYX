import { Request, Response } from "express";
import { environmentService } from "../services/environment.service";

type EnvType = "production" | "development" | "preview";

class EnvironmentController {

  async getEnv(req: Request, res: Response) {
    const { projectId, env } = req.params;

    const selectedEnv = env as EnvType;

    const data = await environmentService.getEnvs(projectId, selectedEnv);
    res.json(data);
  }

  async addVar(req: Request, res: Response) {
    const { projectId, env } = req.params;
    const selectedEnv = env as EnvType;

    const { key, value } = req.body;

    const updated = await environmentService.addOrUpdateVar(projectId, selectedEnv, key, value);
    res.json({ message: "Variable added", env: updated });
  }

  async deleteVar(req: Request, res: Response) {
    const { projectId, env, key } = req.params;
    const selectedEnv = env as EnvType;

    const updated = await environmentService.deleteVar(projectId, selectedEnv, key);
    res.json({ message: "Variable deleted", env: updated });
  }

  async addSecret(req: Request, res: Response) {
    const { projectId, env } = req.params;
    const selectedEnv = env as EnvType;

    const { key, value } = req.body;

    const updated = await environmentService.addOrUpdateSecret(projectId, selectedEnv, key, value);
    res.json({ message: "Secret added", env: updated });
  }

  async deleteSecret(req: Request, res: Response) {
    const { projectId, env, key } = req.params;
    const selectedEnv = env as EnvType;

    const updated = await environmentService.deleteSecret(projectId, selectedEnv, key);
    res.json({ message: "Secret deleted", env: updated });
  }
}

export const environmentController = new EnvironmentController();
