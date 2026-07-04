import mongoose from "mongoose";

const otpAttemptSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    count: {
      type: Number,
      required: true,
      default: 1,
      min: 0
    },
    lockedUntil: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const OtpAttempt = mongoose.model("OtpAttempt", otpAttemptSchema);

export default OtpAttempt;