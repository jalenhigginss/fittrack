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

// ===== TEMP: one-time DB seeding for categories + exercises =====

async function seedOnce() {
  // 1) Ensure tables exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS exercise_categories (
      id   SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS exercises (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      category_id INTEGER NOT NULL
        REFERENCES exercise_categories(id)
        ON DELETE CASCADE
    );
  `);

  // 2) Seed default categories (idempotent)
  const categoryNames = [
    "Push",
    "Pull",
    "Legs",
    "Abs",
    "Shoulders",
    "Arms",
    "Full Body",
    "Upper Body",
    "Lower Body"
  ];

  const existingCats = await pool.query(
    "SELECT name FROM exercise_categories"
  );
  const existingSet = new Set(existingCats.rows.map((r) => r.name));

  for (const name of categoryNames) {
    if (!existingSet.has(name)) {
      await pool.query(
        "INSERT INTO exercise_categories (name) VALUES ($1)",
        [name]
      );
    }
  }

  // 3) Seed some default exercises per category (also idempotent)
  const { rows: cats } = await pool.query(
    "SELECT id, name FROM exercise_categories"
  );
  const idByName = Object.fromEntries(cats.map((c) => [c.name, c.id]));

  const exerciseDefs = [
    ["Push", "Bench Press"],
    ["Push", "Shoulder Press"],
    ["Push", "Tricep Pushdown"],
    ["Pull", "Lat Pulldown"],
    ["Pull", "Barbell Row"],
    ["Pull", "Bicep Curl"],
    ["Legs", "Back Squat"],
    ["Legs", "Romanian Deadlift"],
    ["Legs", "Leg Press"],
    ["Abs", "Crunches"],
    ["Abs", "Hanging Leg Raises"],
    ["Abs", "Plank"]
  ];

  const existingExRows = await pool.query(
    "SELECT name, category_id FROM exercises"
  );
  const existingExSet = new Set(
    existingExRows.rows.map((r) => `${r.name}::${r.category_id}`)
  );

  for (const [catName, exName] of exerciseDefs) {
    const catId = idByName[catName];
    if (!catId) continue; // category missing for some reason

    const key = `${exName}::${catId}`;
    if (!existingExSet.has(key)) {
      await pool.query(
        "INSERT INTO exercises (name, category_id) VALUES ($1, $2)",
        [exName, catId]
      );
    }
  }
}

let hasSeeded = false;

// Temporary route to trigger seeding from the browser
app.post("/api/seed", async (req, res) => {
  try {
    if (!hasSeeded) {
      await seedOnce();
      hasSeeded = true;
    }
    res.json({ ok: true, message: "Database seeded (or already seeded)" });
  } catch (err) {
    console.error("Seeding failed:", err);
    res
      .status(500)
      .json({ error: "Seeding failed", details: err.message ?? String(err) });
  }
});

// ===== END TEMP SEEDING BLOCK =====


app.listen(PORT, () => {
  console.log(`FitTrack API listening on port ${PORT}`);
});

