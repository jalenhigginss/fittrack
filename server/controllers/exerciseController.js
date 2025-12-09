// controllers/exerciseController.js
const pool = require("../db");

exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name
      FROM exercise_categories
      WHERE user_id = $1 OR user_id IS NULL
      ORDER BY name
      `,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

exports.getExercises = async (req, res) => {
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
};

exports.createExercise = async (req, res) => {
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
};
