// controllers/workoutController.js
const pool = require("../db");

exports.getWorkouts = async (req, res) => {
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
    console.error("Error fetching workouts:", err);
    res.status(500).json({ error: "Server error fetching workouts" });
  }
};

exports.createWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exercise, sets, reps, weight, date, workoutName } = req.body;

    if (!exercise) {
      return res.status(400).json({ error: "Exercise is required" });
    }

    const result = await pool.query(
      `INSERT INTO workouts (exercise, sets, reps, weight, date, user_id, workout_name)
       VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), $6, $7)
       RETURNING id, exercise, sets, reps, weight, date, workout_name`,
      [exercise, sets, reps, weight, date || null, userId, workoutName || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating workout:", err);
    res.status(500).json({ error: "Server error creating workout" });
  }
};
