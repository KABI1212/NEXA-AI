import Report from "../models/Report.js";
import Ticket from "../models/Ticket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import { listReportsByUser, saveTicket } from "../utils/localStore.js";

export const myReports = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const reports = await listReportsByUser(req.user._id);
    return res.json({ reports });
  }

  const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ reports });
});

export const createTicket = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const ticket = await saveTicket({ ...req.body, userId: req.user?._id });
    return res.status(201).json({ ticket });
  }

  const ticket = await Ticket.create({ ...req.body, userId: req.user?._id });
  res.status(201).json({ ticket });
});
