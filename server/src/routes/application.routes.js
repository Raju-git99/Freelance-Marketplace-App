import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationsByProject,
  updateApplicationStatus,
  getMyApplications
} from "../controllers/application.controller.js";
import { protect, clientOnly, freelancerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Freelancer applies to a project
router.post("/", protect, freelancerOnly, createApplication);

// get all applications
router.get("/", protect, getApplications);

//  Client gets all applications for their project
router.get("/project/:projectId", protect, clientOnly, getApplicationsByProject);

// Client updates application status (accept/reject)
router.patch("/:id/status", protect, clientOnly, updateApplicationStatus);

//  Freelancer sees their own applications
router.get("/my", protect, freelancerOnly, getMyApplications);

export default router;
