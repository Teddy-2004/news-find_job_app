const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS to allow cross-origin requests
app.use(express.json()); // Middleware to parse JSON request bodies
const path = require("path");
const req = require("express/lib/request");

// Serve static frontend files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Load API keys from environment variables
const FINDWORK_API_KEY = process.env.FINDWORK_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Check if API keys are available
if (!FINDWORK_API_KEY || !NEWS_API_KEY) {
    console.error("❌ API keys missing. Set FINDWORK_API_KEY and NEWS_API_KEY in your .env file.");
    process.exit(1);
}

// ==================== News API Route ====================
app.get("/api/news", async (req, res) => {
    const { category = "technology" } = req.query; // Default category is "technology"

    try {
        // Fetch news from NewsAPI
        const response = await axios.get("https://newsapi.org/v2/top-headlines", {
            params: { category, language: "en", apiKey: NEWS_API_KEY }
        });

        // Filter out articles that don't have content
        const filteredNews = response.data.articles.filter(article => article.content);

        // Send filtered articles to the frontend
        res.json({ articles: filteredNews });
    } catch (error) {
        console.error("❌ News API Error:", error.message);
        res.status(500).json({ error: "Error fetching news" });
    }
});

// ==================== Job Search API Route ====================
app.get("/api/jobs", async (req, res) => {
    const { query, location } = req.query;

    // Validate query and location inputs
    if (!query || !location) {
        return res.status(400).json({ error: "Job title and location are required." });
    }

    try {
        // Fetch jobs from Findwork API
        const response = await axios.get("https://findwork.dev/api/jobs/", {
            headers: { Authorization: `Token ${FINDWORK_API_KEY}` },
            params: { search: query, location }
        });

        // If no jobs are found, return a user-friendly message
        if (!response.data.results || response.data.results.length === 0) {
            return res.status(200).json({ message: `No job listings found in ${location}. Try searching in a different city.` });
        }

        res.json(response.data);
    } catch (error) {
        console.error("❌ Job API Error:", error.response?.status, error.message);

        // Handle 404 Not Found error gracefully
        if (error.response?.status === 404) {
            return res.status(200).json({ message: `No job listings found in ${location}. Try searching in a different city.` });
        }

        res.status(500).json({ error: "Failed to fetch jobs. Please try again later." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});