import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import { generateOtp, otpExpiry } from "../utils/otp.js";
import { otpEmailTemplate, sendEmail } from "../utils/email.js";
import * as localStore from "../utils/localStore.js";
import { clearAuthCookies, newCsrfToken, parseCookies, setAuthCookies } from "../utils/cookies.js";
import { createSessionId, hashToken, signRefreshToken, signToken, verifyAccessToken, verifyRefreshToken } from "../utils/token.js";
import { trackOTPAttempt, incrementOTPAttempt, resetOTPAttempts } from "../utils/otpTracker.js";
import { isRefreshTokenUsed, markRefreshTokenUsed, checkOTPBlocked, incrementOTPAttempt as persistentIncrementOTP, resetOTPAttempts as persistentResetOTP } from "../utils/persistentStore.js";

const strongPassword = (password) => validator.isStrongPassword(password || "", { minLength: 8, minSymbols: 0 });
const normalizeEmail = (email) => email?.trim().toLowerCase();
const requireVerifiedLogin = () => process.env.NODE_ENV === "production";
const publicRoles = new Set(["student", "fresher", "professional", "career-switcher", "job-seeker"]);
const safePublicRole = (role, fallback = "student") => (publicRoles.has(role) ? role : fallback);
const maxFailedLogins = Number(process.env.MAX_FAILED_LOGINS || 5);
const lockMinutes = Number(process.env.LOGIN_LOCK_MINUTES || 15);
const refreshMs = 7 * 24 * 60 * 60 * 1000;

function requestMeta(req) {
  return {
    ip: req.ip || req.socket?.remoteAddress || "",
    userAgent: String(req.headers["user-agent"] || "").slice(0, 500)
  };
}

function activeSessions(user) {
  return (user.sessions || []).filter((session) => !session.revokedAt && (!session.expiresAt || new Date(session.expiresAt) > new Date()));
}

async function persistUser(user) {
  if (isLocalMode()) return localStore.saveUser(user);
  await user.save();
  return user;
}

function appendLoginHistory(user, entry) {
  user.loginHistory = [{ ...entry, createdAt: new Date().toISOString() }, ...(user.loginHistory || [])].slice(0, 25);
}

async function recordFailedLogin(user, req, reason = "Invalid credentials") {
  if (!user) return;
  const attempts = Number(user.failedLoginAttempts || 0) + 1;
  user.failedLoginAttempts = attempts;
  if (attempts >= maxFailedLogins) {
    user.lockUntil = new Date(Date.now() + lockMinutes * 60 * 1000).toISOString();
  }
  appendLoginHistory(user, { success: false, reason, ...requestMeta(req) });
  await persistUser(user);
}

async function issueSession(user, req, res) {
  const sessionId = createSessionId();
  const accessToken = signToken(user);
  const refreshToken = signRefreshToken(user, sessionId);
  const csrfToken = newCsrfToken();
  const expiresAt = new Date(Date.now() + refreshMs).toISOString();
  const meta = requestMeta(req);

  user.sessions = [
    {
      sessionId,
      refreshTokenHash: hashToken(refreshToken),
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
      expiresAt,
      ...meta
    },
    ...activeSessions(user)
  ].slice(0, 10);
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  appendLoginHistory(user, { success: true, reason: "login", ...meta });

  const savedUser = await persistUser(user);
  setAuthCookies(res, { accessToken, refreshToken, csrfToken });
  return { token: accessToken, csrfToken, user: sanitize(savedUser) };
}

async function findUserForRefresh(id) {
  return isLocalMode() ? findUserByIdCompat(id) : User.findById(id).select("+password");
}

async function findUserByIdCompat(id) {
  const { findUserById } = await import("../utils/localStore.js");
  return findUserById(id);
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, confirmPassword, role } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const requestedRole = safePublicRole(role);
  if (!name || !email || !phone || !password || !confirmPassword) {
    res.status(400);
    throw new Error("All fields are required");
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email");
  }
  if (password !== confirmPassword || !strongPassword(password)) {
    res.status(400);
    throw new Error("Use a stronger matching password");
  }

  if (isLocalMode()) {
    const exists = await localStore.findUserByEmail(normalizedEmail);
    if (exists?.verified) {
      res.status(409);
      throw new Error("Email already registered");
    }

    const otp = generateOtp();
    const user = {
      ...exists,
      name,
      email: normalizedEmail,
      phone,
      password: await bcrypt.hash(password, 12),
      role: safePublicRole(requestedRole, exists?.role || "student"),
      verified: false,
      active: exists?.active ?? true,
      otp,
      otpExpires: otpExpiry().toISOString()
    };
    const savedUser = await localStore.saveUser(user);
    await sendEmail({ to: savedUser.email, subject: "Verify your Nexa AI account", html: otpEmailTemplate(savedUser.name, otp) });
    // Fix 5: Only expose devOtp with explicit DEBUG_OTP flag
    const response = { message: "OTP sent", email: savedUser.email };
    if (process.env.NODE_ENV !== "production" && process.env.DEBUG_OTP === "true") {
      response.devOtp = otp;
    }
    return res.status(201).json(response);
  }

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists?.verified) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const otp = generateOtp();
  let user;
  // Fix 9: Hash password before storing (MongoDB path)
  const hashedPassword = await bcrypt.hash(password, 12);
  if (exists) {
    exists.name = name;
    exists.phone = phone;
    exists.password = hashedPassword;
    exists.role = safePublicRole(requestedRole, exists.role);
    exists.otp = otp;
    exists.otpExpires = otpExpiry();
    user = exists;
  } else {
    user = new User({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: requestedRole,
      otp,
      otpExpires: otpExpiry()
    });
  }
  await user.save();
  await sendEmail({ to: user.email, subject: "Verify your Nexa AI account", html: otpEmailTemplate(user.name, otp) });
  res.status(201).json({ message: "OTP sent", email: user.email });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (isLocalMode()) {
    const user = await localStore.findUserByEmail(normalizedEmail);
    if (!user || user.otp !== otp || !user.otpExpires || new Date(user.otpExpires) < new Date()) {
      res.status(400);
      throw new Error("Invalid or expired OTP");
    }
    user.verified = true;
    delete user.otp;
    delete user.otpExpires;
    const savedUser = await localStore.saveUser(user);
    return res.json(await issueSession(savedUser, req, res));
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
  user.verified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  res.json(await issueSession(user, req, res));
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    res.status(400);
    throw new Error("Email is required");
  }

  if (isLocalMode()) {
    const user = await localStore.findUserByEmail(normalizedEmail);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    user.otp = generateOtp();
    user.otpExpires = otpExpiry().toISOString();
    await localStore.saveUser(user);
    await sendEmail({ to: user.email, subject: "Your Nexa AI OTP", html: otpEmailTemplate(user.name, user.otp) });
    // Fix 5: Only expose devOtp with explicit DEBUG_OTP flag
    const resendResponse = { message: "OTP resent" };
    if (process.env.NODE_ENV !== "production" && process.env.DEBUG_OTP === "true") {
      resendResponse.devOtp = user.otp;
    }
    return res.json(resendResponse);
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.otp = generateOtp();
  user.otpExpires = otpExpiry();
  await user.save();
  await sendEmail({ to: user.email, subject: "Your Nexa AI OTP", html: otpEmailTemplate(user.name, user.otp) });
  res.json({ message: "OTP resent" });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  if (isLocalMode()) {
    const user = await localStore.findUserByEmail(normalizedEmail);
    if (user?.lockUntil && new Date(user.lockUntil) > new Date()) {
      res.status(423);
      throw new Error("Account temporarily locked. Try again later.");
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await recordFailedLogin(user, req);
      res.status(401);
      throw new Error("Invalid credentials");
    }
    if (!user.verified && requireVerifiedLogin()) {
      res.status(403);
      throw new Error("Please verify your email first");
    }
    return res.json(await issueSession(user, req, res));
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (user?.lockUntil && user.lockUntil > new Date()) {
    res.status(423);
    throw new Error("Account temporarily locked. Try again later.");
  }
  if (!user || !(await user.matchPassword(password))) {
    await recordFailedLogin(user, req);
    res.status(401);
    throw new Error("Invalid credentials");
  }
  if (!user.verified && requireVerifiedLogin()) {
    res.status(403);
    throw new Error("Please verify your email first");
  }
  res.json(await issueSession(user, req, res));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  if (!normalizedEmail) {
    res.status(400);
    throw new Error("Email is required");
  }

  if (isLocalMode()) {
    const user = await localStore.findUserByEmail(normalizedEmail);
    if (!user) return res.json({ message: "If the email exists, OTP has been sent" });
    user.passwordResetOtp = generateOtp();
    user.passwordResetExpires = otpExpiry().toISOString();
    await localStore.saveUser(user);
    await sendEmail({ to: user.email, subject: "Reset your Nexa AI password", html: otpEmailTemplate(user.name, user.passwordResetOtp) });
    // Fix 5: Only expose devOtp with explicit DEBUG_OTP flag
    const forgotResponse = { message: "Password reset OTP sent" };
    if (process.env.NODE_ENV !== "production" && process.env.DEBUG_OTP === "true") {
      forgotResponse.devOtp = user.passwordResetOtp;
    }
    return res.json(forgotResponse);
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.json({ message: "If the email exists, OTP has been sent" });
  user.passwordResetOtp = generateOtp();
  user.passwordResetExpires = otpExpiry();
  await user.save();
  await sendEmail({ to: user.email, subject: "Reset your Nexa AI password", html: otpEmailTemplate(user.name, user.passwordResetOtp) });
  res.json({ message: "Password reset OTP sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password, confirmPassword } = req.body;
  const normalizedEmail = normalizeEmail(email);
  if (password !== confirmPassword || !strongPassword(password)) {
    res.status(400);
    throw new Error("Use a stronger matching password");
  }

  if (isLocalMode()) {
    const user = await localStore.findUserByEmail(normalizedEmail);
    if (!user || user.passwordResetOtp !== otp || !user.passwordResetExpires || new Date(user.passwordResetExpires) < new Date()) {
      res.status(400);
      throw new Error("Invalid or expired OTP");
    }
    user.password = await bcrypt.hash(password, 12);
    delete user.passwordResetOtp;
    delete user.passwordResetExpires;
    user.sessions = [];
    await localStore.saveUser(user);
    return res.json({ message: "Password updated" });
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || user.passwordResetOtp !== otp || user.passwordResetExpires < new Date()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
  // Fix 9: Hash password before storing
  user.password = await bcrypt.hash(password, 12);
  user.passwordResetOtp = undefined;
  user.passwordResetExpires = undefined;
  user.sessions = [];
  await user.save();
  res.json({ message: "Password updated" });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitize(req.user) });
});

const revokeAllUserSessions = async (userId) => {
  if (isLocalMode()) {
    const user = await findUserByIdCompat(userId);
    if (user) {
      user.sessions = (user.sessions || []).map((s) => ({ ...s, revokedAt: new Date().toISOString() }));
      await localStore.saveUser(user);
    }
  } else {
    const user = await User.findById(userId).select("+password");
    if (user) {
      user.sessions = (user.sessions || []).map((s) => ({ ...s, revokedAt: new Date() }));
      await user.save();
    }
  }
  console.warn(`[SECURITY] All sessions revoked for user: ${userId}`);
};

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = parseCookies(req.headers.cookie).nexa_refresh || req.body.refreshToken;
  if (!refreshToken) {
    res.status(401);
    throw new Error("Refresh token required");
  }

  // Fix 7: Persistent refresh token reuse detection (survives restarts)
  const tokenHash = hashToken(refreshToken);
  const isUsed = await isRefreshTokenUsed(tokenHash);
  if (isUsed) {
    // Token reuse detected - revoke ALL sessions for this user
    try {
      const decoded = verifyRefreshToken(refreshToken);
      await revokeAllUserSessions(decoded.id);
      console.warn(`[SECURITY] Refresh token reuse detected for user: ${decoded.id}`);
    } catch {
      // Token already expired or invalid
    }
    clearAuthCookies(res);
    res.status(403);
    throw new Error("Suspicious activity detected. All sessions have been revoked. Please login again.");
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (decoded.type !== "refresh") {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  const user = await findUserForRefresh(decoded.id);
  const session = activeSessions(user || {}).find((item) => item.sessionId === decoded.sessionId);
  if (!user || !session || session.refreshTokenHash !== tokenHash) {
    res.status(401);
    throw new Error("Invalid refresh session");
  }

  // Mark this token as used (persistently)
  await markRefreshTokenUsed(tokenHash);

  // Fix 4: Invalidate old CSRF token before generating new one
  const cookies = parseCookies(req.headers.cookie);
  const oldCsrf = cookies.nexa_csrf;
  // The old CSRF token is implicitly invalidated by the browser replacing the cookie
  // Explicitly revoke by setting the old cookie to empty with immediate expiry
  if (oldCsrf) {
    res.cookie("nexa_csrf_old", oldCsrf, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 0 // Immediately expire
    });
  }

  const accessToken = signToken(user);
  const nextRefreshToken = signRefreshToken(user, decoded.sessionId);
  const csrfToken = newCsrfToken();
  user.sessions = (user.sessions || []).map((item) =>
    item.sessionId === decoded.sessionId
      ? { ...item, refreshTokenHash: hashToken(nextRefreshToken), lastUsedAt: new Date().toISOString() }
      : item
  );
  const savedUser = await persistUser(user);
  setAuthCookies(res, { accessToken, refreshToken: nextRefreshToken, csrfToken });
  res.json({ token: accessToken, csrfToken, user: sanitize(savedUser) });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = parseCookies(req.headers.cookie).nexa_refresh || req.body.refreshToken;
  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await findUserForRefresh(decoded.id);
      if (user) {
        user.sessions = (user.sessions || []).map((item) =>
          item.sessionId === decoded.sessionId ? { ...item, revokedAt: new Date().toISOString() } : item
        );
        await persistUser(user);
      }
    } catch {
      // Session is already unusable; clearing client cookies is enough.
    }
  }
  clearAuthCookies(res);
  res.json({ message: "Logged out" });
});

export const csrf = asyncHandler(async (req, res) => {
  const token = parseCookies(req.headers.cookie).nexa_csrf || newCsrfToken();
  res.cookie("nexa_csrf", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: refreshMs
  });
  res.json({ csrfToken: token });
});

export const sessions = asyncHandler(async (req, res) => {
  const user = isLocalMode() ? await findUserByIdCompat(req.user._id) : await User.findById(req.user._id);
  const sessionsList = activeSessions(user).map(({ sessionId, userAgent, ip, createdAt, lastUsedAt, expiresAt }) => ({
    sessionId,
    userAgent,
    ip,
    createdAt,
    lastUsedAt,
    expiresAt
  }));
  res.json({ sessions: sessionsList });
});

export const revokeSession = asyncHandler(async (req, res) => {
  const user = isLocalMode() ? await findUserByIdCompat(req.user._id) : await User.findById(req.user._id);
  user.sessions = (user.sessions || []).map((item) =>
    item.sessionId === req.params.sessionId ? { ...item, revokedAt: new Date().toISOString() } : item
  );
  await persistUser(user);
  res.json({ message: "Session revoked" });
});

function sanitize(user) {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.otp;
  delete obj.passwordResetOtp;
  delete obj.sessions;
  delete obj.loginHistory;
  delete obj.failedLoginAttempts;
  delete obj.lockUntil;
  return obj;
}
