import express from "express";
import { createTicket, myReports } from "../controllers/report.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", protect, myReports);
router.post("/tickets", protect, createTicket);
export default router;
