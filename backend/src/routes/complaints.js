import { Router } from "express";
import Complaint from "../models/Complaint.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, async (req, res) => {
  const filter = req.user.role === "student" ? { student: req.user.id } : {};
  const complaints = await Complaint.find(filter).populate("student", "name email").sort({ createdAt: -1 });
  res.json(complaints);
});

router.post("/", protect, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Only students can create complaints" });
  const { title, category, block, room, description, imageUrl } = req.body;
  if (!title || !category || !block || !room || !description) return res.status(400).json({ message: "Please fill all required fields" });
  const complaint = await Complaint.create({ title, category, block, room, description, imageUrl, student: req.user.id });
  res.status(201).json(complaint);
});

router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  const { status, assignedTo } = req.body;
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status, assignedTo: assignedTo || null }, { new: true });
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.json(complaint);
});

export default router;
