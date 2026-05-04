import { Router } from "express";
const router = Router();
import {
  createProject,
  allProjects,
  singleProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  allMember,
} from "../controllers/project.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

router.get("/", allProjects);

router.use(protect, restrictTo("admin"));
router.post("/", createProject);
router.get("/:id", singleProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

//              ADD MEMBER
//_________________________________

router.patch("/:id/members", addMember);
router.delete("/:id/members/:userId", removeMember);
router.get("/:id/members", allMember);

export default router;
