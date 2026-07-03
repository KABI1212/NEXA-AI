import jwt from "jsonwebtoken";
import { createHash, randomUUID } from "crypto";

export function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m"
  });
}

export function signRefreshToken(user, sessionId) {
  return jwt.sign({ id: user._id, sessionId, type: "refresh" }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionId() {
  return randomUUID();
}
