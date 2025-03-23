const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const path = require("path");

// Serve frontend files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Keys from .env file (Ensure you have these set in your .env)
const FINDWORK_API_KEY = process.env.FINDWORK_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

if (!FINDWORK_API_KEY || !NEWS_API_KEY) {
    console.error("❌ API keys missing. Set FINDWORK_API_KEY and NEWS_API_KEY in your .env file.");
    process.exit(1);
}

// News API Route
app.get("/api/news", async (req, res) => {
    const { category = "technology" } = req.query; // Default category to "technology"

    try {
        const response = await axios.get("https://newsapi.org/v2/top-headlines", {
            params: {
                category: category,
                language: "en",
                apiKey: NEWS_API_KEY
            }
        });

        const filteredNews = response.data.articles.filter(article => article.content);
        res.json({ articles: filteredNews });
    } catch (error) {
        console.error("❌ News API Error:", error.message);
        res.status(500).json({ error: "Error fetching news" });
    }
});

// Job Search API Route
app.get("/api/jobs", async (req, res) => {
    const { query, location } = req.query;

    try {
        const response = await axios.get("https://findwork.dev/api/jobs/", {
            headers: { Authorization: `Token ${FINDWORK_API_KEY}` },
            params: { search: query, location: location }
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ Error fetching jobs:", error.message);
        res.status(500).json({ error: "Error fetching jobs" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
