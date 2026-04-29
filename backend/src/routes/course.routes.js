import express from "express";
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse, updateProgress } from "../controllers/course.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", listCourses);
router.get("/:slug", protect, getCourse);
router.post("/", protect, authorize("admin"), createCourse);
router.put("/:id", protect, authorize("admin"), updateCourse);
router.delete("/:id", protect, authorize("admin"), deleteCourse);
router.post("/:courseId/progress", protect, updateProgress);
export default router;
