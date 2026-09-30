const mongoose = require("mongoose");

const PickupRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    wasteType: { type: String, default: "General" },
    address: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "completed"], default: "pending" },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PickupRequest", PickupRequestSchema);
