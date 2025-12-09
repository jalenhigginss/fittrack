// routes/motivationRoutes.js
const express = require("express");
const router = express.Router();
const { getMotivation } = require("../controllers/motivationController");

router.get("/motivation", getMotivation);

module.exports = router;
