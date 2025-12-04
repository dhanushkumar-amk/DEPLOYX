import { Request, Response } from "express";
import { projectService } from "../services/project.service";

class ProjectController {
  async create(req: Request, res: Response) {
    const { orgId, name, framework, region } = req.body;

    const project = await projectService.createProject(orgId, name, framework, region);

    res.json({
      message: "Project created successfully",
      project
    });
  }

  async get(req: Request, res: Response) {
    const id = req.params.id;
    const project = await projectService.getProjectById(id);
    res.json(project);
  }

  async list(req: Request, res: Response) {
    const orgId = req.params.orgId;
    const projects = await projectService.listProjectsByOrg(orgId);
    res.json(projects);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    await projectService.deleteProject(id);
    res.json({ message: "Project deleted" });
  }
}

export const projectController = new ProjectController();
