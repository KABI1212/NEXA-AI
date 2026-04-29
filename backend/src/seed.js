import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";

dotenv.config();
await connectDB();

await Course.deleteMany({});
await Course.insertMany([
  {
    title: "Full Stack Web Development",
    slug: "full-stack-web-development",
    category: "Web Development",
    instructor: "Prof. Rahul Sharma",
    level: "Beginner to Advanced",
    premium: false,
    price: 0,
    description: "Master React, Node.js, Express, MongoDB, deployment, interviews, and portfolio projects.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    modules: [
      { title: "HTML, CSS and JavaScript Foundations", duration: "52m", assignment: "Build a responsive landing page" },
      { title: "React and Component Architecture", duration: "1h 20m", assignment: "Build a dashboard UI" },
      { title: "Node, Express and MongoDB APIs", duration: "1h 35m", assignment: "Create REST API with auth" },
      { title: "Deployment and Career Portfolio", duration: "48m", assignment: "Deploy full-stack app" }
    ],
    quiz: [{ question: "Which library builds UI components?", options: ["React", "MongoDB", "JWT"], answer: "React" }],
    finalTest: [{ question: "Which pattern protects APIs?", options: ["JWT auth", "Inline CSS", "Console logs"], answer: "JWT auth" }]
  },
  {
    title: "AI and Machine Learning Career Track",
    slug: "ai-machine-learning-career-track",
    category: "AI / Machine Learning",
    instructor: "Dr. Meera Iyer",
    premium: false,
    price: 0,
    description: "Python, ML basics, model evaluation, prompt engineering, and AI product thinking.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    modules: [{ title: "AI Foundations", duration: "45m" }, { title: "ML Projects", duration: "1h" }, { title: "Prompt Engineering", duration: "40m" }]
  },
  {
    title: "Placement Prep and Communication",
    slug: "placement-prep-communication",
    category: "Placement Prep",
    instructor: "Ananya Rao",
    premium: false,
    price: 0,
    description: "Aptitude, resume writing, HR answers, and confidence-building practice.",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    modules: [{ title: "Aptitude Basics", duration: "35m" }, { title: "HR Interview Answers", duration: "42m" }]
  }
]);

const adminEmail = "admin@nexa.ai";
const existing = await User.findOne({ email: adminEmail });
if (!existing) {
  await User.create({
    name: "Nexa Admin",
    email: adminEmail,
    phone: "9999999999",
    password: "Admin@12345",
    role: "admin",
    verified: true
  });
}

console.log("Seed complete. Admin: admin@nexa.ai / Admin@12345");
process.exit(0);
