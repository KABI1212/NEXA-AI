/**
 * Persistent store for security-critical data (refresh token reuse, OTP tracking).
 * Uses localStore (JSON file) for local mode and MongoDB for production.
 * This replaces in-memory Sets/Maps that are lost on server restart.
 */
import { isLocalMode } from "./dataMode.js";
import * as localStore from "./localStore.js";

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const OTP_LOCK_TTL = 15 * 60 * 1000; // 15 minutes in ms
const MAX_OTP_ATTEMPTS = 5;

// ─── Refresh Token Reuse Detection ───────────────────────────────────────────

/**
 * Check if a refresh token hash has been used before (reuse detection).
 * @param {string} tokenHash - SHA-256 hash of the refresh token
 * @returns {Promise<boolean>} - true if token was already used
 */
export async function isRefreshTokenUsed(tokenHash) {
  if (isLocalMode()) {
    const store = await localStore.readRawStore();
    return store.usedRefreshTokens?.some(
      (t) => t.hash === tokenHash && t.expiresAt > Date.now()
    ) || false;
  }
  // MongoDB implementation
  const { default: UsedToken } = await import("../models/UsedToken.js");
  const found = await UsedToken.findOne({ hash: tokenHash, expiresAt: { $gt: new Date() } });
  return !!found;
}

/**
 * Mark a refresh token hash as used (for reuse detection).
 * @param {string} tokenHash - SHA-256 hash of the refresh token
 * @returns {Promise<void>}
 */
export async function markRefreshTokenUsed(tokenHash) {
  if (isLocalMode()) {
    await localStore.updateStore((store) => {
      if (!store.usedRefreshTokens) store.usedRefreshTokens = [];
      // Remove expired entries
      store.usedRefreshTokens = store.usedRefreshTokens.filter(
        (t) => t.expiresAt > Date.now()
      );
      store.usedRefreshTokens.push({
        hash: tokenHash,
        createdAt: Date.now(),
        expiresAt: Date.now() + REFRESH_TOKEN_TTL
      });
      return store;
    });
    return;
  }
  // MongoDB implementation
  const { default: UsedToken } = await import("../models/UsedToken.js");
  await UsedToken.create({
    hash: tokenHash,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
  });
}

/**
 * Clean up expired used refresh tokens.
 * @returns {Promise<void>}
 */
export async function cleanupExpiredRefreshTokens() {
  if (isLocalMode()) {
    await localStore.updateStore((store) => {
      if (store.usedRefreshTokens) {
        store.usedRefreshTokens = store.usedRefreshTokens.filter(
          (t) => t.expiresAt > Date.now()
        );
      }
      return store;
    });
    return;
  }
  const { default: UsedToken } = await import("../models/UsedToken.js");
  await UsedToken.deleteMany({ expiresAt: { $lte: new Date() } });
}

// ─── OTP Attempt Tracking ────────────────────────────────────────────────────

/**
 * Check if OTP attempts are blocked for an email.
 * @param {string} email
 * @returns {Promise<{blocked: boolean, message?: string, remainingTime?: number}>}
 */
export async function checkOTPBlocked(email) {
  const key = `otp_${email}`;
  if (isLocalMode()) {
    const store = await localStore.readRawStore();
    if (!store.otpAttempts) store.otpAttempts = {};
    const record = store.otpAttempts[key];
    if (record) {
      if (record.lockedUntil && record.lockedUntil > Date.now()) {
        return {
          blocked: true,
          message: "Too many failed attempts. Try again in 15 minutes.",
          remainingTime: Math.ceil((record.lockedUntil - Date.now()) / 60000)
        };
      }
      // Reset if lock expired
      if (record.lockedUntil && record.lockedUntil <= Date.now()) {
        delete store.otpAttempts[key];
        await localStore.writeRawStore(store);
      }
    }
    return { blocked: false };
  }
  // MongoDB implementation
  const { default: OtpAttempt } = await import("../models/OtpAttempt.js");
  const record = await OtpAttempt.findOne({ email });
  if (record && record.lockedUntil && record.lockedUntil > new Date()) {
    return {
      blocked: true,
      message: "Too many failed attempts. Try again in 15 minutes.",
      remainingTime: Math.ceil((record.lockedUntil - new Date()) / 60000)
    };
  }
  if (record && record.lockedUntil && record.lockedUntil <= new Date()) {
    await OtpAttempt.deleteOne({ email });
  }
  return { blocked: false };
}

/**
 * Increment OTP attempt count for an email.
 * @param {string} email
 * @returns {Promise<{blocked: boolean}>}
 */
export async function incrementOTPAttempt(email) {
  const key = `otp_${email}`;
  if (isLocalMode()) {
    return localStore.updateStore((store) => {
      if (!store.otpAttempts) store.otpAttempts = {};
      const record = store.otpAttempts[key] || { count: 0, lockedUntil: null };

      // Check if already locked
      if (record.lockedUntil && record.lockedUntil > Date.now()) {
        return { blocked: true };
      }

      record.count = (record.count || 0) + 1;

      // Lock after MAX_OTP_ATTEMPTS failed attempts
      if (record.count >= MAX_OTP_ATTEMPTS) {
        record.lockedUntil = Date.now() + OTP_LOCK_TTL;
      }

      store.otpAttempts[key] = record;
      return { blocked: false };
    });
  }
  // MongoDB implementation
  const { default: OtpAttempt } = await import("../models/OtpAttempt.js");
  const record = await OtpAttempt.findOne({ email });
  if (record && record.lockedUntil && record.lockedUntil > new Date()) {
    return { blocked: true };
  }
  if (record) {
    record.count += 1;
    if (record.count >= MAX_OTP_ATTEMPTS) {
      record.lockedUntil = new Date(Date.now() + OTP_LOCK_TTL);
    }
    await record.save();
  } else {
    await OtpAttempt.create({ email, count: 1 });
  }
  return { blocked: false };
}

/**
 * Reset OTP attempt count for an email (on successful verification).
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function resetOTPAttempts(email) {
  const key = `otp_${email}`;
  if (isLocalMode()) {
    await localStore.updateStore((store) => {
      if (store.otpAttempts) {
        delete store.otpAttempts[key];
      }
      return store;
    });
    return;
  }
  const { default: OtpAttempt } = await import("../models/OtpAttempt.js");
  await OtpAttempt.deleteOne({ email });
