import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { createProjectValidator } from "../validators/project.validator";



const router = Router();

router.post("/", createProjectValidator, projectController.create.bind(projectController));
router.get("/:id", projectController.get.bind(projectController));
router.get("/org/:orgId", projectController.list.bind(projectController));
router.delete("/:id", projectController.delete.bind(projectController));

export default router;
