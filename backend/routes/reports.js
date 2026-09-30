const express = require("express");
const router = express.Router();
const multer = require("multer");
const Report = require("../models/Report");
const auth = require("../middleware/auth");
const { requireRole } = auth;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB, these are small demo reports
});

router.post(
  "/upload",
  auth,
  requireRole("recycler"),
  upload.single("report"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "report file is required" });

      const report = await Report.create({
        uploadedBy: req.user.id,
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
      });

      res.status(201).json({ id: report._id, filename: report.filename });
    } catch (error) {
      res.status(500).json({ message: "Error uploading report", error: error.message });
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const reports = await Report.find().select("-data").sort({ createdAt: -1 });
    const withUrls = reports.map((r) => ({
      id: r._id,
      filename: r.filename,
      createdAt: r.createdAt,
      url: `/api/reports/${r._id}/download`,
    }));
    res.json(withUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
});

router.get("/:id/download", auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    res.set("Content-Type", report.contentType);
    res.set("Content-Disposition", `attachment; filename="${report.filename}"`);
    res.send(report.data);
  } catch (error) {
    res.status(500).json({ message: "Error downloading report", error: error.message });
  }
});

module.exports = router;
