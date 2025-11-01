import express from "express";
import { registerUser, loginUser, updateMe } from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Register route
router.post("/register", registerUser);

// ✅ Login route
router.post("/login", loginUser);

router.put("/me", protect, updateMe);

export default router;
