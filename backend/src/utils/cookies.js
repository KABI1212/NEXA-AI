import { randomBytes } from "crypto";

const isProduction = () => process.env.NODE_ENV === "production";

export function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        const key = index >= 0 ? part.slice(0, index) : part;
        const value = index >= 0 ? part.slice(index + 1) : "";
        return [key, decodeURIComponent(value)];
      })
  );
}

export function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    path: "/",
    maxAge
  };
}

export function csrfCookieOptions(maxAge) {
  return {
    httpOnly: false,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    path: "/",
    maxAge
  };
}

export function newCsrfToken() {
  return randomBytes(32).toString("hex");
}

export function setAuthCookies(res, { accessToken, refreshToken, csrfToken }) {
  res.cookie("nexa_access", accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie("nexa_refresh", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
  res.cookie("nexa_csrf", csrfToken, csrfCookieOptions(7 * 24 * 60 * 60 * 1000));
}

export function clearAuthCookies(res) {
  res.clearCookie("nexa_access", { path: "/" });
  res.clearCookie("nexa_refresh", { path: "/" });
  res.clearCookie("nexa_csrf", { path: "/" });
}
