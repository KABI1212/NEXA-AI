import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    certificateId: { type: String, required: true, unique: true },
    studentName: String,
    courseName: String,
    instructorName: String,
    ceoName: { type: String, default: "Kabilesh" },
    score: Number,
    qrUrl: String,
    issueDate: { type: Date, default: Date.now },
    completionDate: { type: Date, default: Date.now },
    verified: { type: Boolean, default: true },
    revokedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
