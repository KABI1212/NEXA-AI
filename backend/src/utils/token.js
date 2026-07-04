import jwt from "jsonwebtoken";
import { createHash, randomUUID } from "crypto";

// Fix 2: Use separate access/refresh secrets with proper defaults
const accessSecret = () => process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

export function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, accessSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m"
  });
}

export function signRefreshToken(user, sessionId) {
  return jwt.sign({ id: user._id, sessionId, type: "refresh" }, refreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret());
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret());
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionId() {
  return randomUUID();
}
