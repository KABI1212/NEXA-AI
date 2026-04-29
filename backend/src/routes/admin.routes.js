import express from "express";
import { certificates, overview, tickets, users } from "../controllers/admin.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect, authorize("admin"));
router.get("/overview", overview);
router.get("/users", users);
router.get("/certificates", certificates);
router.get("/tickets", tickets);
export default router;
