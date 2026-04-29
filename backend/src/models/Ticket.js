import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    subject: String,
    message: String,
    status: { type: String, enum: ["open", "pending", "closed"], default: "open" }
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
