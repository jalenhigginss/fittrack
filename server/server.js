// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FitTrack API running' });
});

// Auth routes (register, login)
app.use('/api/auth', authRoutes);

// GET /api/workouts - get workouts for the logged-in user (protected)
app.get('/api/workouts', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT id, exercise, sets, reps, weight, date, workout_name
       FROM workouts
       WHERE user_id = $1
       ORDER BY date DESC, id DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching workouts:', err);
    res.status(500).json({ error: 'Server error fetching workouts' });
  }
});


// POST /api/workouts - create a new workout for the logged-in user (protected)
app.post('/api/workouts', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { exercise, sets, reps, weight, date, workoutName } = req.body;

    if (!exercise) {
      return res.status(400).json({ error: 'Exercise is required' });
    }

    const result = await pool.query(
      `INSERT INTO workouts (exercise, sets, reps, weight, date, user_id, workout_name)
       VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), $6, $7)
       RETURNING id, exercise, sets, reps, weight, date, workout_name`,
      [exercise, sets, reps, weight, date || null, userId, workoutName || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating workout:', err);
    res.status(500).json({ error: 'Server error creating workout' });
  }
});

app.listen(PORT, () => {
  console.log(`FitTrack API listening on port ${PORT}`);
});

// ---------- Exercise Categories (global, only those that have exercises) ----------
app.get("/api/exercise-categories", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT DISTINCT c.id, c.name
      FROM exercise_categories c
      JOIN exercises e ON e.category_id = c.id
      ORDER BY c.name
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error fetching categories" });
  }
});



// ---------- Exercises ----------
app.get("/api/exercises", authMiddleware, async (req, res) => {
  const { categoryId } = req.query;

  try {
    let sql = "SELECT id, name, category_id FROM exercises";
    const params = [];

    if (categoryId) {
      sql += " WHERE category_id = $1 ORDER BY name";
      params.push(Number(categoryId));
    } else {
      sql += " ORDER BY name";
    }

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching exercises:", err);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});




app.post("/api/exercises", authMiddleware, async (req, res) => {
  const { name, categoryId } = req.body;

  if (!name || !categoryId) {
    return res.status(400).json({ error: "name and categoryId are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO exercises (name, category_id) VALUES ($1, $2) RETURNING id, name, category_id",
      [name, Number(categoryId)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting exercise:", err);
    res.status(500).json({ error: "Failed to add exercise" });
  }
});
