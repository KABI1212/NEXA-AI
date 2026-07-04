import nodemailer from "nodemailer";
import { isLocalMode } from "./dataMode.js";

function escapeHtml(value) {
  const ampersand = String.fromCharCode(38);
  const lt = String.fromCharCode(60, 116, 59);
  const gt = String.fromCharCode(62, 116, 59);
  const quot = String.fromCharCode(38, 113, 117, 111, 116, 59);
  const apos = String.fromCharCode(38, 35, 51, 57, 59);
  return String(value)
    .replace(new RegExp(String.fromCharCode(38), "g"), ampersand + "amp;")
    .replace(new RegExp(String.fromCharCode(60), "g"), ampersand + "lt;")
    .replace(new RegExp(String.fromCharCode(62), "g"), ampersand + "gt;")
    .replace(new RegExp('"', "g"), ampersand + "quot;")
    .replace(new RegExp("'", "g"), ampersand + "#39;");
}

export async function sendEmail({ to, subject, html }) {
  if (isLocalMode() || !process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log("[MAIL MOCK] " + subject + " -> " + to);
    if (process.env.NODE_ENV === "development") {
      console.log("Email content:", { to, subject });
    }
    return { mocked: true };
  }

  const secure = process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  try {
    return await transporter.sendMail({
      from: process.env.MAIL_FROM || "Nexa AI <no-reply@nexa.ai>",
      to: to,
      subject: subject,
      html: html
    });
  } catch (error) {
    console.warn("[MAIL FALLBACK] " + subject + " -> " + to + ": " + error.message);
    return { mocked: true };
  }
}

export function otpEmailTemplate(name, otp) {
  var safeName = escapeHtml(name);
  var safeOtp = escapeHtml(otp);
  var divStart = '<div style="font-family:Inter,Arial,sans-serif;background:#07152f;padding:32px;color:#fff">';
  var divInner = '<div style="max-width:560px;margin:auto;background:#fff;color:#111827;border-radius:16px;padding:28px">';
  var h1 = '<h1 style="color:#0f4fd8">Nexa AI</h1>';
  var p1 = "<p>Hi " + safeName + ",</p>";
  var p2 = "<p>Your verification code is:</p>";
  var otpDiv = '<div style="font-size:34px;font-weight:800;letter-spacing:8px;color:#0f4fd8">' + safeOtp + "</div>";
  var p3 = "<p>This code expires in 10 minutes.</p>";
  var p4 = '<p style="color:#6b7280">Next Step for the Future</p>';
  return divStart + "\n" + divInner + "\n" + h1 + "\n" + p1 + "\n" + p2 + "\n" + otpDiv + "\n" + p3 + "\n" + p4 + "\n</div>\n</div>";
}