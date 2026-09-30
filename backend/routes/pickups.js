const express = require("express");
const router = express.Router();
const PickupRequest = require("../models/PickupRequest");
const auth = require("../middleware/auth");
const { requireRole } = auth;

// User schedules a pickup
router.post("/", auth, requireRole("user"), async (req, res) => {
  try {
    const { wasteType, address, date } = req.body;
    if (!address || !date) {
      return res.status(400).json({ message: "address and date are required" });
    }

    const pickup = await PickupRequest.create({
      user: req.user.id,
      wasteType,
      address,
      date,
    });

    res.status(201).json(pickup);
  } catch (error) {
    res.status(500).json({ message: "Error scheduling pickup", error: error.message });
  }
});

// Current user's own pickups
router.get("/mine", auth, async (req, res) => {
  try {
    const pickups = await PickupRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pickups", error: error.message });
  }
});

// Pending pickups, visible to recyclers/collectors who can accept them
router.get("/scheduled", auth, requireRole("recycler", "collector"), async (req, res) => {
  try {
    const pickups = await PickupRequest.find({ status: "pending" })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scheduled pickups", error: error.message });
  }
});

// Completed pickups (for the "track recycled material" view)
router.get("/completed", auth, requireRole("recycler", "collector"), async (req, res) => {
  try {
    const pickups = await PickupRequest.find({ status: "completed" })
      .populate("user", "name email")
      .sort({ updatedAt: -1 });
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching completed pickups", error: error.message });
  }
});

// Recycler/collector accepts a pending pickup
router.post("/:id/accept", auth, requireRole("recycler", "collector"), async (req, res) => {
  try {
    const pickup = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      { status: "accepted", handledBy: req.user.id },
      { new: true }
    );
    if (!pickup) return res.status(404).json({ message: "Pickup not found" });
    res.json(pickup);
  } catch (error) {
    res.status(500).json({ message: "Error accepting pickup", error: error.message });
  }
});

// Recycler/collector marks a pickup as completed
router.post("/:id/complete", auth, requireRole("recycler", "collector"), async (req, res) => {
  try {
    const pickup = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      { status: "completed", handledBy: req.user.id },
      { new: true }
    );
    if (!pickup) return res.status(404).json({ message: "Pickup not found" });
    res.json(pickup);
  } catch (error) {
    res.status(500).json({ message: "Error completing pickup", error: error.message });
  }
});

module.exports = router;
