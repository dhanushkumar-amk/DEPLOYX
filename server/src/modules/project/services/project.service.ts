import slugify from "slugify";
import { Project } from "../models/project.model";

class ProjectService {
  async createProject(orgId: string, name: string, framework: string, region: string) {
    const slug = slugify(name, { lower: true }) + "-" + Date.now();

    const project = await Project.create({
      orgId,
      name,
      slug,
      framework,
      region
    });

    return project;
  }

  async getProjectById(projectId: string) {
    return Project.findById(projectId);
  }

  async listProjectsByOrg(orgId: string) {
    return Project.find({ orgId, status: "active" });
  }

  async deleteProject(projectId: string) {
    return Project.findByIdAndUpdate(projectId, { status: "deleted" });
  }
}

export const projectService = new ProjectService();
