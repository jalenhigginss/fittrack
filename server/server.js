// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const authRoutes = require("./routes/auth");
const workoutRoutes = require("./routes/workoutRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const motivationRoutes = require("./routes/motivationRoutes"); // if you have it

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "FitTrack API running" });
});

// Auth
app.use("/api/auth", authRoutes);

// Workouts
app.use("/api/workouts", workoutRoutes);

// Exercises + categories
app.use("/api", exerciseRoutes);

// External API
app.use("/api", motivationRoutes); // optional

app.listen(PORT, () => {
  console.log(`FitTrack API listening on port ${PORT}`);
});

