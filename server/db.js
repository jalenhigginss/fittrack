// server/db.js
const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: connectionString && connectionString.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
});

// This runs once on server startup – creates tables and seeds default data
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS exercise_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        user_id INTEGER REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS exercises (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category_id INTEGER REFERENCES exercise_categories(id),
        UNIQUE (name, category_id)
      );

      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        exercise TEXT NOT NULL,
        sets INTEGER,
        reps INTEGER,
        weight NUMERIC,
        date DATE DEFAULT CURRENT_DATE,
        workout_name TEXT
      );
    `);

    const defaultCategories = [
      "Chest",
      "Back",
      "Legs",
      "Shoulders",
      "Arms",
      "Abs",
      "Cardio",
    ];

    for (const name of defaultCategories) {
      await pool.query(
        `INSERT INTO exercise_categories (name, user_id)
         VALUES ($1, NULL)
         ON CONFLICT (name) DO NOTHING`,
        [name]
      );
    }

    console.log("✅ Database initialized (tables + default categories)");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
}

initDatabase();

// 🔴 IMPORTANT: export the Pool instance itself
module.exports = pool;
