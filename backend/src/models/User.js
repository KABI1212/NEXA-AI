import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const onboardingSchema = new mongoose.Schema(
  {
    qualification: String,
    department: String,
    skills: [String],
    interests: [String],
    experience: String,
    dreamJob: String,
    dreamCompany: String,
    preferredCountry: String,
    salaryGoal: String
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    refreshTokenHash: { type: String, required: true },
    userAgent: String,
    ip: String,
    createdAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now },
    expiresAt: Date,
    revokedAt: Date
  },
  { _id: false }
);

const loginHistorySchema = new mongoose.Schema(
  {
    success: Boolean,
    ip: String,
    userAgent: String,
    reason: String,
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["student", "fresher", "professional", "career-switcher", "job-seeker", "mentor", "admin"], default: "student" },
    verified: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    sessions: [sessionSchema],
    loginHistory: [loginHistorySchema],
    aiUses: { type: Number, default: 0 },
    otp: String,
    otpExpires: Date,
    passwordResetOtp: String,
    passwordResetExpires: Date,
    onboarding: onboardingSchema
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
