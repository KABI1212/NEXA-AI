import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    watchedModules: [{ type: mongoose.Schema.Types.ObjectId }],
    assignmentsDone: { type: Boolean, default: false },
    quizPassed: { type: Boolean, default: false },
    finalPassed: { type: Boolean, default: false },
    quizScore: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
