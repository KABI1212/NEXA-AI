import express from "express";
import { dashboard, saveOnboarding, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect);
router.get("/dashboard", dashboard);
router.put("/onboarding", saveOnboarding);
router.put("/profile", updateProfile);
export default router;
