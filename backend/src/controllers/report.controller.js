import Report from "../models/Report.js";
import Ticket from "../models/Ticket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import { listReportsByUser, saveTicket } from "../utils/localStore.js";

function cleanTicket(body = {}) {
  const ticket = {
    name: String(body.name || "").trim().slice(0, 120),
    email: String(body.email || "").trim().toLowerCase().slice(0, 254),
    subject: String(body.subject || "").trim().slice(0, 160),
    message: String(body.message || "").trim().slice(0, 4000)
  };
  if (!ticket.subject || !ticket.message) {
    throw new Error("Subject and message are required");
  }
  return ticket;
}

export const myReports = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const reports = await listReportsByUser(req.user._id);
    return res.json({ reports });
  }

  const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ reports });
});

export const createTicket = asyncHandler(async (req, res) => {
  let ticketPayload;
  try {
    ticketPayload = cleanTicket(req.body);
  } catch (error) {
    res.status(400);
    throw error;
  }
  if (isLocalMode()) {
    const ticket = await saveTicket({ ...ticketPayload, userId: req.user?._id });
    return res.status(201).json({ ticket });
  }

  const ticket = await Ticket.create({ ...ticketPayload, userId: req.user?._id });
  res.status(201).json({ ticket });
});
