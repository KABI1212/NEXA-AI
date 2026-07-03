import express from "express";
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse, updateProgress } from "../controllers/course.controller.js";
import { authorize, protect, optionalProtect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", listCourses);
router.get("/:slug", optionalProtect, getCourse);
router.post("/", protect, authorize("admin", "mentor"), createCourse);
router.put("/:id", protect, authorize("admin", "mentor"), updateCourse);
router.delete("/:id", protect, authorize("admin"), deleteCourse);
router.post("/:courseId/progress", protect, updateProgress);
export default router;
