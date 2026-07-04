import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
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
import careerRoutes from "./routes/career.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { requireCsrf } from "./middleware/auth.middleware.js";
import { globalLimiter, authLimiter, otpLimiter, resetLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

// Fix 8: Weak JWT Secret Fallback - fail fast if not set properly
const jwtSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret === "replace-with-a-long-random-secret" || jwtSecret === "dev-login-secret-change-before-production") {
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

// Fix 23: Helmet CSP Configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", ...(clientOrigins || [])],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginResourcePolicy: { policy: "same-site" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
}));

app.use(cors({
  origin: clientOrigins?.length ? clientOrigins : isProduction ? false : "*",
  credentials: Boolean(clientOrigins?.length)
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Fix 3 & 13: Rate limiting BEFORE CSRF (important!)
app.use(globalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/verify-otp", otpLimiter);
app.use("/api/auth/resend-otp", otpLimiter);
app.use("/api/auth/forgot-password", resetLimiter);

// Then CSRF middleware
app.use(requireCsrf);

// Fix 22: Uploads Directory Access - only serve in dev with auth check
if (!isProduction) {
  app.use("/uploads", (req, res, next) => {
    if (!req.headers.authorization && !req.headers.cookie) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  });
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
}

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
app.use("/api/career", careerRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

await connectDB();
app.listen(PORT, () => console.log(`Nexa AI API running on port ${PORT}`));
