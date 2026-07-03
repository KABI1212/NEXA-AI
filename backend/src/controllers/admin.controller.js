import User from "../models/User.js";
import Course from "../models/Course.js";
import Certificate from "../models/Certificate.js";
import Report from "../models/Report.js";
import Ticket from "../models/Ticket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import { countCertificates, countOpenTickets, countReports, countUsers, countPublishedCourses, listCertificates, listTickets, listUsers } from "../utils/localStore.js";

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

export const overview = asyncHandler(async (_req, res) => {
  if (isLocalMode()) {
    const [users, courses, certificates, reports, tickets] = await Promise.all([
      countUsers(),
      countPublishedCourses(),
      countCertificates(),
      countReports(),
      countOpenTickets()
    ]);
    return res.json({
      users,
      courses,
      certificates,
      reports,
      openTickets: tickets
    });
  }

  const [users, courses, certificates, reports, tickets] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Certificate.countDocuments(),
    Report.countDocuments(),
    Ticket.countDocuments({ status: { $ne: "closed" } })
  ]);
  res.json({
    users,
    courses,
    certificates,
    reports,
    openTickets: tickets
  });
});

export const users = asyncHandler(async (_req, res) => {
  if (isLocalMode()) {
    return res.json({ users: (await listUsers()).map(sanitizeUser) });
  }

  res.json({ users: (await User.find().select("-password -sessions -loginHistory").sort({ createdAt: -1 })).map(sanitizeUser) });
});

export const certificates = asyncHandler(async (_req, res) => {
  if (isLocalMode()) {
    const usersById = Object.fromEntries((await listUsers()).map((user) => [user._id, user]));
    const certificatesList = (await listCertificates()).map((certificate) => ({
      ...certificate,
      userId: usersById[certificate.userId]
        ? { _id: usersById[certificate.userId]._id, name: usersById[certificate.userId].name, email: usersById[certificate.userId].email }
        : certificate.userId
    }));
    return res.json({ certificates: certificatesList });
  }

  res.json({ certificates: await Certificate.find().populate("userId", "name email").sort({ createdAt: -1 }) });
});

export const tickets = asyncHandler(async (_req, res) => {
  if (isLocalMode()) {
    return res.json({ tickets: await listTickets() });
  }

  res.json({ tickets: await Ticket.find().sort({ createdAt: -1 }) });
});
