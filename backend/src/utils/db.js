import mongoose from "mongoose";
import { hasUsableMongoUri, setDataMode } from "./dataMode.js";

export default async function connectDB() {
  const uri = process.env.MONGO_URI?.trim();
  if (!hasUsableMongoUri(uri)) {
    setDataMode("local");
    console.warn("MongoDB is not configured. Using local JSON storage in backend/data/local-db.json.");
    return false;
  }

  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    setDataMode("mongo");
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    setDataMode("local");
    console.warn(`MongoDB connection failed. Using local JSON storage instead. ${error.message}`);
    return false;
  }
}
