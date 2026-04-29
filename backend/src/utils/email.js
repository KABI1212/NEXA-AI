import nodemailer from "nodemailer";
import { isLocalMode } from "./dataMode.js";

export async function sendEmail({ to, subject, html }) {
  if (isLocalMode() || !process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log(`[MAIL MOCK] ${subject} -> ${to}`);
    return { mocked: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  try {
    return await transporter.sendMail({
      from: process.env.MAIL_FROM || "Nexa AI <no-reply@nexa.ai>",
      to,
      subject,
      html
    });
  } catch (error) {
    console.warn(`[MAIL FALLBACK] ${subject} -> ${to}: ${error.message}`);
    return { mocked: true };
  }
}

export function otpEmailTemplate(name, otp) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#07152f;padding:32px;color:#fff">
      <div style="max-width:560px;margin:auto;background:#fff;color:#111827;border-radius:16px;padding:28px">
        <h1 style="color:#0f4fd8">Nexa AI</h1>
        <p>Hi ${name},</p>
        <p>Your verification code is:</p>
        <div style="font-size:34px;font-weight:800;letter-spacing:8px;color:#0f4fd8">${otp}</div>
        <p>This code expires in 10 minutes.</p>
        <p style="color:#6b7280">Next Step fo the Future</p>
      </div>
    </div>`;
}
