import { Router } from "express";
import Complaint from "../models/Complaint.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// GET all complaints for logged-in user (students see only theirs, admins/staff see all)
router.get("/", protect, async (req, res) => {
  try {
    const filter = req.user.role === "student" ? { student: req.user.id } : {};
    const complaints = await Complaint.find(filter)
      .populate("student", "name email")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// POST create new complaint (students only)
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can create complaints" });
    }
    const { title, category, block, room, description, imageUrl } = req.body;
    if (!title || !category || !block || !room || !description) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    const complaint = await Complaint.create({
      title: title.trim(),
      category: category.trim(),
      block: block.trim(),
      room: room.trim(),
      description: description.trim(),
      imageUrl: imageUrl ? imageUrl.trim() : "",
      student: req.user.id
    });

    const populated = await Complaint.findById(complaint._id).populate("student", "name email");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Error creating complaint:", err);
    res.status(500).json({ message: "Failed to create complaint" });
  }
});

// PATCH update complaint status / staff assignment (admin only)
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const allowedStatuses = ["Pending", "Assigned", "In Progress", "Resolved"];
    
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("student", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (err) {
    console.error("Error updating complaint:", err);
    res.status(500).json({ message: "Failed to update complaint status" });
  }
});

export default router;
