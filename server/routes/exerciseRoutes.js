// routes/exerciseRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const exerciseController = require("../controllers/exerciseController");

// /api/exercise-categories
router.get("/exercise-categories", authMiddleware, exerciseController.getCategories);

// /api/exercises?categoryId=...
router.get("/exercises", authMiddleware, exerciseController.getExercises);

// POST /api/exercises
router.post("/exercises", authMiddleware, exerciseController.createExercise);

module.exports = router;
