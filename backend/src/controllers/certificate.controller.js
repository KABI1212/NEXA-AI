import QRCode from "qrcode";
import Certificate from "../models/Certificate.js";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import {
  findCertificateByCode,
  findCertificateById,
  findCertificateByUserAndCourse,
  findCourseById,
  findProgress,
  listCertificatesByUser,
  saveCertificate
} from "../utils/localStore.js";

export async function createCertificateForProgress(user, course, progress) {
  const certificateId = `NXA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
  const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify/${certificateId}`;
  const qrUrl = await QRCode.toDataURL(verifyUrl);
  const issueDate = new Date();
  const completionDate = new Date();

  if (isLocalMode()) {
    return saveCertificate({
      userId: user._id,
      courseId: course._id,
      certificateId,
      studentName: user.name,
      courseName: course.title,
      instructorName: course.instructor,
      score: Math.round((progress.quizScore + progress.finalScore) / 2) || 92,
      qrUrl,
      issueDate: issueDate.toISOString(),
      completionDate: completionDate.toISOString()
    });
  }

  return Certificate.create({
    userId: user._id,
    courseId: course._id,
    certificateId,
    studentName: user.name,
    courseName: course.title,
    instructorName: course.instructor,
    score: Math.round((progress.quizScore + progress.finalScore) / 2) || 92,
    qrUrl,
    issueDate,
    completionDate
  });
}

export const myCertificates = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const certificates = await listCertificatesByUser(req.user._id);
    return res.json({ certificates });
  }

  const certificates = await Certificate.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ certificates });
});

export const issueCertificate = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const course = await findCourseById(req.body.courseId);
    const progress = await findProgress(req.user._id, req.body.courseId);
    if (!course || !progress?.completed) {
      res.status(400);
      throw new Error("Complete all course requirements to unlock certificate");
    }
    const existing = await findCertificateByUserAndCourse(req.user._id, course._id);
    const certificate = existing || (await createCertificateForProgress(req.user, course, progress));
    return res.status(existing ? 200 : 201).json({ certificate });
  }

  const course = await Course.findById(req.body.courseId);
  const progress = await Progress.findOne({ userId: req.user._id, courseId: req.body.courseId });
  if (!course || !progress?.completed) {
    res.status(400);
    throw new Error("Complete all course requirements to unlock certificate");
  }
  const existing = await Certificate.findOne({ userId: req.user._id, courseId: course._id });
  const certificate = existing || (await createCertificateForProgress(req.user, course, progress));
  res.status(existing ? 200 : 201).json({ certificate });
});

export const verifyCertificate = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const certificate = await findCertificateByCode(req.params.certificateId);
    if (!certificate || certificate.revokedAt || !certificate.verified) {
      return res.status(404).json({ valid: false, message: "Certificate is not valid" });
    }
    return res.json({ valid: true, certificate });
  }

  const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
  if (!certificate || certificate.revokedAt || !certificate.verified) {
    return res.status(404).json({ valid: false, message: "Certificate is not valid" });
  }
  res.json({ valid: true, certificate });
});

export const revokeCertificate = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const certificate = await findCertificateById(req.params.id);
    if (!certificate) {
      res.status(404);
      throw new Error("Certificate not found");
    }
    const savedCertificate = await saveCertificate({
      ...certificate,
      verified: false,
      revokedAt: new Date().toISOString()
    });
    return res.json({ certificate: savedCertificate });
  }

  const certificate = await Certificate.findByIdAndUpdate(
    req.params.id,
    { verified: false, revokedAt: new Date() },
    { new: true }
  );
  if (!certificate) {
    res.status(404);
    throw new Error("Certificate not found");
  }
  res.json({ certificate });
});
