import express from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { careerExplorer, companyInsights, interviewPrep, mentorChat, resumeAnalyzer, skillGap } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedMimeTypes = new Set([
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${Date.now()}-${randomUUID()}${extension}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) return cb(new Error("Unsupported resume file type"));
    cb(null, true);
  }
});

const router = express.Router();
router.use(protect);
router.post("/career-explorer", careerExplorer);
router.post("/resume-analyzer", upload.single("resume"), resumeAnalyzer);
router.post("/interview-prep", interviewPrep);
router.post("/company-insights", companyInsights);
router.post("/skill-gap", skillGap);
router.post("/mentor-chat", mentorChat);
export default router;
