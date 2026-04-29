import express from "express";
import { careerExplorer, companyInsights, interviewPrep, mentorChat, resumeAnalyzer, skillGap } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect);
router.post("/career-explorer", careerExplorer);
router.post("/resume-analyzer", resumeAnalyzer);
router.post("/interview-prep", interviewPrep);
router.post("/company-insights", companyInsights);
router.post("/skill-gap", skillGap);
router.post("/mentor-chat", mentorChat);
export default router;
