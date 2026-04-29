import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import { findUserById } from "../utils/localStore.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401);
    throw new Error("Authentication required");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = isLocalMode()
    ? await findUserById(decoded.id)
    : await User.findById(decoded.id).select("-password -otp -passwordResetOtp");
  if (!user || !user.active) {
    res.status(401);
    throw new Error("Invalid account");
  }
  if (isLocalMode()) {
    delete user.password;
    delete user.otp;
    delete user.passwordResetOtp;
  }
  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error("Insufficient permissions");
  }
  next();
};
