// @ts-nocheck
// In-memory OTP attempt tracking (use Redis in production)
const otpAttempts = new Map();

export const trackOTPAttempt = (email) => {
  const key = `otp_attempts_${email}`;
  const attempts = otpAttempts.get(key) || { count: 0, lockedUntil: null };
  
  // Check if locked
  if (attempts.lockedUntil && new Date() < new Date(attempts.lockedUntil)) {
    return { 
      blocked: true, 
      message: "Too many failed attempts. Try again in 15 minutes.",
      remainingTime: Math.ceil((new Date(attempts.lockedUntil) - new Date()) / 60000)
    };
  }
  
  // Reset lock if expired
  if (attempts.lockedUntil && new Date() >= new Date(attempts.lockedUntil)) {
    attempts.count = 0;
    attempts.lockedUntil = null;
  }
  
  return { blocked: false, attempts };
};

export const incrementOTPAttempt = (email) => {
  const key = `otp_attempts_${email}`;
  const current = otpAttempts.get(key) || { count: 0, lockedUntil: null };
  
  // Check if already locked
  if (current.lockedUntil && new Date() < new Date(current.lockedUntil)) {
    return { blocked: true };
  }
  
  current.count += 1;
  
  // Lock after 5 failed attempts
  if (current.count >= 5) {
    current.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lock
  }
  
  otpAttempts.set(key, current);
  return { blocked: false, attempts: current };
};

export const resetOTPAttempts = (email) => {
  const key = `otp_attempts_${email}`;
  otpAttempts.delete(key);
};

export const clearOTPAttempts = () => {
  otpAttempts.clear();
};