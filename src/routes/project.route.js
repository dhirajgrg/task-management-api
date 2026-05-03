import { Router } from "express";
const router = Router();
import {
  createProject,
  allProjects,
  singleProject,
  updateProject,
  deleteProject
} from "../controllers/project.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

router.get("/", allProjects);

router.use(protect,restrictTo('admin'))
router.post("/", createProject);
router.get("/:id", singleProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
