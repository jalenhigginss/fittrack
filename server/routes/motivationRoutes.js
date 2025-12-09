// server/routes/motivationRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getMotivation } = require("../controllers/motivationController");

// GET /api/motivation
router.get("/motivation", authMiddleware, getMotivation);

module.exports = router;
