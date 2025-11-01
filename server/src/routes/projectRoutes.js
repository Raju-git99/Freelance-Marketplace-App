import express from "express";
import { createProject, getProjects, getProjectById,updateProject, deleteProject, getMyProjects} from "../controllers/project.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST - Create project (only client)
// GET - Fetch all projects
router.route("/")
  .post(protect, createProject)
  .get(getProjects);

// GET - Single project details
router.route("/:id").get(getProjectById);

router.put("/:id", protect, updateProject);
// Delete project
router.delete("/:id", protect, deleteProject);
router.get("/my", protect, getMyProjects);
export default router;
