import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import { generateOtp, otpExpiry } from "../utils/otp.js";
import { otpEmailTemplate, sendEmail } from "../utils/email.js";
import { findUserByEmail, saveUser } from "../utils/localStore.js";
import { signToken } from "../utils/token.js";

const strongPassword = (password) => validator.isStrongPassword(password || "", { minLength: 8, minSymbols: 0 });
const normalizeEmail = (email) => email?.trim().toLowerCase();

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, confirmPassword, role } = req.body;
  const normalizedEmail = normalizeEmail(email);
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
    const exists = await findUserByEmail(normalizedEmail);
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
      role: role || exists?.role || "student",
      verified: false,
      active: exists?.active ?? true,
      otp,
      otpExpires: otpExpiry().toISOString()
    };
    const savedUser = await saveUser(user);
    await sendEmail({ to: savedUser.email, subject: "Verify your Nexa AI account", html: otpEmailTemplate(savedUser.name, otp) });
    return res.status(201).json({ message: "OTP sent", email: savedUser.email, devOtp: otp });
  }

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists?.verified) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const otp = generateOtp();
  const user =
    exists ||
    new User({
      name,
      email: normalizedEmail,
      phone,
      password,
      role
    });
  user.name = name;
  user.email = normalizedEmail;
  user.phone = phone;
  user.password = password;
  user.role = role || user.role;
  user.otp = otp;
  user.otpExpires = otpExpiry();
  await user.save();

  await sendEmail({ to: user.email, subject: "Verify your Nexa AI account", html: otpEmailTemplate(user.name, otp) });
  res.status(201).json({ message: "OTP sent", email: user.email });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (isLocalMode()) {
    const user = await findUserByEmail(normalizedEmail);
    if (!user || user.otp !== otp || !user.otpExpires || new Date(user.otpExpires) < new Date()) {
      res.status(400);
      throw new Error("Invalid or expired OTP");
    }
    user.verified = true;
    delete user.otp;
    delete user.otpExpires;
    const savedUser = await saveUser(user);
    return res.json({ token: signToken(savedUser), user: sanitize(savedUser) });
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
  user.verified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.json({ token: signToken(user), user: sanitize(user) });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    res.status(400);
    throw new Error("Email is required");
  }

  if (isLocalMode()) {
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    user.otp = generateOtp();
    user.otpExpires = otpExpiry().toISOString();
    await saveUser(user);
    await sendEmail({ to: user.email, subject: "Your Nexa AI OTP", html: otpEmailTemplate(user.name, user.otp) });
    return res.json({ message: "OTP resent", devOtp: user.otp });
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
    const user = await findUserByEmail(normalizedEmail);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401);
      throw new Error("Invalid credentials");
    }
    if (!user.verified) {
      res.status(403);
      throw new Error("Please verify your email first");
    }
    return res.json({ token: signToken(user), user: sanitize(user) });
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  if (!user.verified) {
    res.status(403);
    throw new Error("Please verify your email first");
  }
  res.json({ token: signToken(user), user: sanitize(user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  if (!normalizedEmail) {
    res.status(400);
    throw new Error("Email is required");
  }

  if (isLocalMode()) {
    const user = await findUserByEmail(normalizedEmail);
    if (!user) return res.json({ message: "If the email exists, OTP has been sent" });
    user.passwordResetOtp = generateOtp();
    user.passwordResetExpires = otpExpiry().toISOString();
    await saveUser(user);
    await sendEmail({ to: user.email, subject: "Reset your Nexa AI password", html: otpEmailTemplate(user.name, user.passwordResetOtp) });
    return res.json({ message: "Password reset OTP sent", devOtp: user.passwordResetOtp });
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
    const user = await findUserByEmail(normalizedEmail);
    if (!user || user.passwordResetOtp !== otp || !user.passwordResetExpires || new Date(user.passwordResetExpires) < new Date()) {
      res.status(400);
      throw new Error("Invalid or expired OTP");
    }
    user.password = await bcrypt.hash(password, 12);
    delete user.passwordResetOtp;
    delete user.passwordResetExpires;
    await saveUser(user);
    return res.json({ message: "Password updated" });
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || user.passwordResetOtp !== otp || user.passwordResetExpires < new Date()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
  user.password = password;
  user.passwordResetOtp = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ message: "Password updated" });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

function sanitize(user) {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.otp;
  delete obj.passwordResetOtp;
  return obj;
}
