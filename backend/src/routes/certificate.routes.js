import express from "express";
import { issueCertificate, myCertificates, revokeCertificate, verifyCertificate } from "../controllers/certificate.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/mine", protect, myCertificates);
router.post("/issue", protect, issueCertificate);
router.get("/verify/:certificateId", verifyCertificate);
router.patch("/:id/revoke", protect, authorize("admin"), revokeCertificate);
export default router;
