const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const pickupRoutes = require("./routes/pickups");
const reportRoutes = require("./routes/reports");

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  throw new Error(`Missing required environment variable(s): ${missingEnv.join(", ")}`);
}

// Serverless platforms (Vercel) reuse warm function instances between
// invocations, so we cache the connection promise instead of reconnecting
// (and erroring) on every request.
let connectionPromise = null;
function ensureDbConnected() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("✅ MongoDB Connected"))
      .catch((err) => {
        connectionPromise = null;
        console.error("❌ MongoDB Connection Error:", err);
        throw err;
      });
  }
  return connectionPromise;
}

const app = express();

app.use(express.json());

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use((req, res, next) => {
  ensureDbConnected()
    .then(() => next())
    .catch(() => res.status(503).json({ message: "Database unavailable" }));
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/reports", reportRoutes);

module.exports = app;
