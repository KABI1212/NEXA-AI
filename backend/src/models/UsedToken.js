import mongoose from "mongoose";

const usedTokenSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // TTL index - automatically deletes expired docs
    }
  },
  { timestamps: true }
);

// Compound index for faster lookups
usedTokenSchema.index({ hash: 1, expiresAt: 1 });

const UsedToken = mongoose.model("UsedToken", usedTokenSchema);

export default UsedToken;