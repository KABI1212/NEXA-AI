import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { requireCsrf } from "./middleware/auth.middleware.js";

dotenv.config();

if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET === "replace-with-a-long-random-secret"
) {
  if (process.env.NODE_ENV === "production") {
    console.error("FATAL: JWT_SECRET is not configured. Set a strong secret in .env");
    process.exit(1);
  }
  console.warn("JWT_SECRET is using a development fallback. Set a strong secret before production.");
  process.env.JWT_SECRET = "dev-login-secret-change-before-production";
}

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === "production";
const clientOrigins = process.env.CLIENT_URL?.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: clientOrigins?.length ? clientOrigins : isProduction ? false : "*",
  credentials: Boolean(clientOrigins?.length)
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requireCsrf);
if (!isProduction) {
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
}
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "Nexa AI API", tagline: "Next Step for the Future" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

await connectDB();
app.listen(PORT, () => console.log(`Nexa AI API running on port ${PORT}`));
