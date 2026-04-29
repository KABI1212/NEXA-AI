import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: String,
    videoUrl: String,
    duration: String,
    notesUrl: String,
    assignment: String
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    instructor: { type: String, required: true },
    thumbnail: String,
    level: { type: String, default: "Beginner" },
    price: { type: Number, default: 0, min: 0 },
    premium: { type: Boolean, default: false },
    description: String,
    modules: [moduleSchema],
    quiz: [{ question: String, options: [String], answer: String }],
    finalTest: [{ question: String, options: [String], answer: String }],
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

courseSchema.pre("validate", function enforceFreeCourses(next) {
  this.price = 0;
  this.premium = false;
  next();
});

export default mongoose.model("Course", courseSchema);
