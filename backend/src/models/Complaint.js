import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  block: { type: String, required: true },
  room: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Assigned", "In Progress", "Resolved"], default: "Pending" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);
