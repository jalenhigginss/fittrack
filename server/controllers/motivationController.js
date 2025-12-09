// server/controllers/motivationController.js
const axios = require("axios");

async function getMotivation(req, res) {
  try {
    const apiUrl = process.env.MOTIVATION_API_URL;

    if (!apiUrl) {
      return res.status(500).json({
        error: "MOTIVATION_API_URL is not set on the server",
      });
    }

    // Type.fit returns an array of quotes: [{ text, author }, ...]
    const response = await axios.get(apiUrl);
    const quotes = response.data;

    if (!Array.isArray(quotes) || quotes.length === 0) {
      return res.status(500).json({
        error: "No quotes received from external API",
      });
    }

    const random = quotes[Math.floor(Math.random() * quotes.length)];

    res.json({
      quote: random.text,
      author: random.author || "Unknown",
      source: "type.fit",
    });
  } catch (err) {
    console.error("Error fetching motivation quote:", err.message);
    res.status(500).json({
      error: "Failed to fetch motivation quote",
    });
  }
}

module.exports = {
  getMotivation,
};
