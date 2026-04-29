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
      courseCount
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
    courseCount
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone", "role"];
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));

  if (isLocalMode()) {
    const user = await findUserById(req.user._id);
    const savedUser = await saveUser({ ...user, ...update });
    return res.json({ user: sanitizeUser(savedUser) });
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-password");
  res.json({ user });
});
