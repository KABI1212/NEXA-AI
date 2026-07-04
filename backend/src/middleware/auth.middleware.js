// @ts-nocheck
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import { findUserById } from "../utils/localStore.js";
import { parseCookies } from "../utils/cookies.js";

// Fix 11: CSRF token generation with expiration (prevents replay attacks)
const csrfTokens = new Map();

export const generateCsrfToken = (userId) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

  // Invalidate old tokens for this user
  if (csrfTokens.has(userId)) {
    const userTokens = csrfTokens.get(userId);
    for (const [existingToken, data] of userTokens) {
      if (data.expiresAt < Date.now()) {
        userTokens.delete(existingToken);
      }
    }
  }

  if (!csrfTokens.has(userId)) {
    csrfTokens.set(userId, new Map());
  }
  csrfTokens.get(userId).set(token, { expiresAt });
  return token;
};

export const validateCsrfToken = (userId, token) => {
  const userTokens = csrfTokens.get(userId);
  if (!userTokens) return false;

  const tokenData = userTokens.get(token);
  if (!tokenData) return false;

  // Check expiry
  if (tokenData.expiresAt < Date.now()) {
    userTokens.delete(token);
    return false;
  }

  // Invalidate token after use (prevent replay)
  userTokens.delete(token);
  return true;
};

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
  if (!roles.includes(req.user?.role)) {
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

  // Skip CSRF check for Bearer token auth (SPA uses Authorization header)
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) return next();

  const cookies = parseCookies(req.headers.cookie);
  const hasCookieAuth = Boolean(cookies.nexa_access || cookies.nexa_refresh);
  if (!hasCookieAuth) return next();

  const headerToken = req.headers["x-csrf-token"];
  const cookieToken = cookies.nexa_csrf;

  if (!cookieToken || !headerToken) {
    res.status(403);
    return next(new Error("Missing CSRF token"));
  }

  // Fix 11: Enhanced CSRF validation with token expiry check
  if (cookieToken !== headerToken) {
    res.status(403);
    return next(new Error("Invalid CSRF token"));
  }

  // If user is authenticated, validate their CSRF token exists in our store
  if (req.user && req.user._id) {
    const isValid = validateCsrfToken(String(req.user._id), headerToken);
    if (!isValid) {
      res.status(403);
      return next(new Error("CSRF token expired or already used"));
    }
  }

  next();
}
