import { Project } from "../models/project.model";

type EnvType = "production" | "development" | "preview";

class EnvironmentService {

  async getEnvs(projectId: string, env: EnvType) {
    const project = await Project.findById(projectId);
    return project?.environments?.[env];
  }

  async addOrUpdateVar(projectId: string, env: EnvType, key: string, value: string) {
    const update: Record<string, any> = {};
    update[`environments.${env}.vars.${key}`] = value;

    return Project.findByIdAndUpdate(projectId, { $set: update }, { new: true });
  }

  async deleteVar(projectId: string, env: EnvType, key: string) {
    const unset: Record<string, any> = {};
    unset[`environments.${env}.vars.${key}`] = "";

    return Project.findByIdAndUpdate(projectId, { $unset: unset }, { new: true });
  }

  async addOrUpdateSecret(projectId: string, env: EnvType, key: string, value: string) {
    const update: Record<string, any> = {};
    update[`environments.${env}.secrets.${key}`] = value;

    return Project.findByIdAndUpdate(projectId, { $set: update }, { new: true });
  }

  async deleteSecret(projectId: string, env: EnvType, key: string) {
    const unset: Record<string, any> = {};
    unset[`environments.${env}.secrets.${key}`] = "";

    return Project.findByIdAndUpdate(projectId, { $unset: unset }, { new: true });
  }
}

export const environmentService = new EnvironmentService();
