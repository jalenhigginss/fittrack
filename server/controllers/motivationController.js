// controllers/motivationController.js
const axios = require("axios");

exports.getMotivation = async (req, res) => {
  try {
    const response = await axios.get("https://api.quotable.io/random");
    const { content, author } = response.data;
    res.json({ content, author });
  } catch (err) {
    console.error("Error fetching quote:", err);
    res.status(500).json({ error: "Failed to fetch motivation quote" });
  }
};
