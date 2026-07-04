import User from "../models/User.js";
import Progress from "../models/Progress.js";
import Certificate from "../models/Certificate.js";
import Course from "../models/Course.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import { countPublishedCourses, findUserById, listCertificatesByUser, listProgressByUser, saveUser } from "../utils/localStore.js";

function sanitizeUser(user) {
  const nextUser = user?.toObject ? user.toObject() : { ...user };
  delete nextUser.password;
  delete nextUser.otp;
  delete nextUser.passwordResetOtp;
  delete nextUser.sessions;
  delete nextUser.loginHistory;
  delete nextUser.failedLoginAttempts;
  delete nextUser.lockUntil;
  return nextUser;
}

export const saveOnboarding = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const user = await findUserById(req.user._id);
    const savedUser = await saveUser({ ...user, onboarding: req.body });
    return res.json({ user: sanitizeUser(savedUser) });
  }

  const user = await User.findByIdAndUpdate(req.user._id, { onboarding: req.body }, { new: true }).select("-password");
  res.json({ user });
});

export const dashboard = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const [progress, certificates, courseCount] = await Promise.all([
      listProgressByUser(req.user._id),
      listCertificatesByUser(req.user._id),
      countPublishedCourses()
    ]);
    const completed = progress.filter((item) => item.completed).length;
    return res.json({
      careerScore: Math.min(98, 54 + completed * 8 + certificates.filter((item) => item.verified).length * 5),
      resumeScore: 76,
      coursesCompleted: completed,
      certificatesEarned: certificates.filter((item) => item.verified).length,
      missingSkills: ["System design", "Cloud deployment", "Interview storytelling"],
      jobsTrending: ["AI Engineer", "Full Stack Developer", "Cybersecurity Analyst", "Data Scientist"],
      courseCount,
      progress
    });
  }

  const [progress, certificates, courseCount] = await Promise.all([
    Progress.find({ userId: req.user._id }),
    Certificate.find({ userId: req.user._id, verified: true }),
    Course.countDocuments({ published: true })
  ]);
  const completed = progress.filter((p) => p.completed).length;
  res.json({
    careerScore: Math.min(98, 54 + completed * 8 + certificates.length * 5),
    resumeScore: 76,
    coursesCompleted: completed,
    certificatesEarned: certificates.length,
    missingSkills: ["System design", "Cloud deployment", "Interview storytelling"],
    jobsTrending: ["AI Engineer", "Full Stack Developer", "Cybersecurity Analyst", "Data Scientist"],
    courseCount,
    progress
  });
});

const validateProfileUpdate = (data) => {
  const errors = [];
  if (data.name !== undefined) {
    if (typeof data.name !== "string" || data.name.trim().length < 2 || data.name.trim().length > 50) {
      errors.push("Name must be between 2 and 50 characters");
    }
  }
  if (data.phone !== undefined) {
    if (typeof data.phone !== "string" || !/^\+?[\d\s\-()]{10,15}$/.test(data.phone)) {
      errors.push("Invalid phone number format. Use 10-15 digits with optional + prefix.");
    }
  }
  return errors;
};

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone", "role"];
  const publicRoles = new Set(["student", "fresher", "professional", "career-switcher", "job-seeker"]);
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));

  // Fix 5: Add input validation for profile updates
  const validationErrors = validateProfileUpdate(update);
  if (validationErrors.length > 0) {
    res.status(400);
    throw new Error(validationErrors.join("; "));
  }

  if (update.role && !publicRoles.has(update.role)) {
    res.status(400);
    throw new Error("Invalid role");
  }
  if (req.user.role === "admin") delete update.role;

  if (isLocalMode()) {
    const user = await findUserById(req.user._id);
    const savedUser = await saveUser({ ...user, ...update });
    return res.json({ user: sanitizeUser(savedUser) });
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-password");
  res.json({ user });
});
