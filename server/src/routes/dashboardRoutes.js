import express from "express";
import Project from "../models/Project.js";   // ⬅️ don't forget to import Project
import Application from "../models/Application.js";
import { protect, freelancerOnly, clientOnly } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/client", protect, clientOnly, async (req, res) => {
//   try {
//     const projects = await Project.find({ client: req.user.id });
//     res.json({ projects });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * FREELANCER DASHBOARD
//  * Get applications made by the logged-in freelancer
//  */
// router.get("/freelancer", protect, freelancerOnly, async (req, res) => {
//   try {
//     console.log("Fetching applications for freelancer:", req.user.id);

//     const applications = await Application.find({ freelancer: req.user.id })
//       .populate("project", "title description budget");

//     if (!applications || applications.length === 0) {
//       return res.status(404).json({ message: "No applications found" });
//     }

//     res.status(200).json({ applications });
//   } catch (err) {
//     console.error("Error fetching freelancer applications:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


// export default router;

const router = express.Router();


router.get("/client", protect, clientOnly, async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id });
    res.json({ projects }); // frontend expects { projects: [...] }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/freelancer", protect, freelancerOnly, async (req, res) => {
  try {
    const applications = await Application.find({ freelancer: req.user.id })
      .populate("project", "title description budgetMin budgetMax skillsRequired");

    res.json({ applications }); // frontend expects { applications: [...] }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;