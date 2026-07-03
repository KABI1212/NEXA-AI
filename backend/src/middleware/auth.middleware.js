import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import { findUserById } from "../utils/localStore.js";
import { parseCookies } from "../utils/cookies.js";

function readAccessToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return parseCookies(req.headers.cookie).nexa_access || null;
}

export const protect = asyncHandler(async (req, res, next) => {
  const token = readAccessToken(req);
  if (!token) {
    res.status(401);
    throw new Error("Authentication required");
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error("Invalid or expired token");
  }
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

export const optionalProtect = asyncHandler(async (req, res, next) => {
  const token = readAccessToken(req);
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = isLocalMode()
      ? await findUserById(decoded.id)
      : await User.findById(decoded.id).select("-password -otp -passwordResetOtp");
    if (user && user.active) {
      if (isLocalMode()) {
        delete user.password;
        delete user.otp;
        delete user.passwordResetOtp;
      }
      req.user = user;
    }
  } catch {
    // invalid token - continue as guest
  }
  next();
});

export function requireCsrf(req, res, next) {
  const unsafe = !["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (!unsafe) return next();

  const cookies = parseCookies(req.headers.cookie);
  const hasCookieAuth = Boolean(cookies.nexa_access || cookies.nexa_refresh);
  if (!hasCookieAuth) return next();

  const headerToken = req.headers["x-csrf-token"];
  if (!cookies.nexa_csrf || !headerToken || cookies.nexa_csrf !== headerToken) {
    res.status(403);
    return next(new Error("Invalid CSRF token"));
  }
  next();
}
