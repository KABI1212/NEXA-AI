import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["career", "resume", "course", "skill-gap", "company", "interview"], required: true },
    title: String,
    data: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
