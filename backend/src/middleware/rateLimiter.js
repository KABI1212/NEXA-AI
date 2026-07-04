import rateLimit from "express-rate-limit";

// Global rate limiter
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Reduced from 500 to 100
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Allow internal services if needed
    return req.headers["x-internal-service"] === "true";
  }
});

// Auth-specific rate limiter (strict)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 attempts per 15 minutes
  message: { error: "Too many authentication attempts. Please try again after 15 minutes." },
  skipSuccessfulRequests: true, // Don't count successful logins
});

// OTP-specific rate limiter (very strict)
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Only 3 OTP attempts per 15 minutes
  message: { error: "Too many OTP attempts. Please try again after 15 minutes." },
  skipSuccessfulRequests: true,
});

// Password reset limiter
export const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // Only 2 reset requests per hour
  message: { error: "Too many password reset attempts. Please try again in an hour." },
});