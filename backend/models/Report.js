const mongoose = require("mongoose");

// File content is stored inline (small demo-scale reports only) rather than on
// disk, since free-tier hosts (e.g. Render) wipe local disk on every restart/redeploy.
const ReportSchema = new mongoose.Schema(
  {
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
