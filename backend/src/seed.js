import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import { defaultCourses } from "./utils/courseCatalog.js";
import { isLocalMode } from "./utils/dataMode.js";
import { replaceCourses } from "./utils/localStore.js";

dotenv.config();
await connectDB();

if (isLocalMode()) {
  await replaceCourses(defaultCourses);
} else {
  await Course.deleteMany({});
  await Course.insertMany(defaultCourses);
}

const adminEmail = "admin@nexa.ai";
if (!isLocalMode()) {
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
}

console.log("Seeded 6 courses successfully");
process.exit(0);
