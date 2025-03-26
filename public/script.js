function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("show");
}

function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

// Tab Navigation Function
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

    // Remove "active" class from all tab buttons
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));

    // Show the selected tab and highlight the button
    document.getElementById(tabName).classList.add("active");
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add("active");
}

// ==================== Fetch and Display News ====================
async function fetchNews() {
    try {
        // Fetch news data from backend API
        const response = await fetch("/api/news");
        const data = await response.json();

        // Display news articles dynamically
        document.getElementById("news-results").innerHTML = data.articles.map(article => `
            <div class="news-detail">
                <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" alt="${article.title}">
                <div>
                    <h3>${article.title}</h3>
                    <p>${article.source.name}</p>
                    <a href="${article.url}" target="_blank">Read More</a>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("❌ Error fetching news:", error.message);
        document.getElementById("news-results").innerHTML = "<p>Error fetching news.</p>";
    }
}


function redirectToNews() {
    window.location.href = "news.html"; // Redirect to news.html
}


// Automatically fetch news when on news.html
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("news.html")) {
        fetchNews();
    }

});


// ==================== Search and Display Jobs ====================
async function searchJobs(query, location) {
    // If no user input, default to software jobs in London
    if (!query || !location) {
        query = "software";
        location = "london";
    }

    // Clear previous results before fetching new ones
    document.getElementById("job-results").innerHTML = "<p>Loading jobs...</p>";

    try {
        // Fetch job listings from backend API
        const response = await fetch(`/api/jobs?query=${query}&location=${location}`);
        const data = await response.json();

        // If no jobs are found, display a user-friendly message
        if (!data.results || data.results.length === 0) {
            document.getElementById("job-results").innerHTML = `<p>No job listings found in ${location}. Try searching in a different city.</p>`;
            return;
        }

        // Display new search results
        document.getElementById("job-results").innerHTML = data.results.map(job => `
            <div class="job">
                <h3>${job.role}</h3>
                <p>${job.company_name} - ${job.location}</p>
                <a href="${job.url}" target="_blank">View Job</a>
            </div>
        `).join("");

    } catch (error) {
        console.error("❌ Job Search Error:", error.message);
        document.getElementById("job-results").innerHTML = `<p>Error fetching jobs. Please try again.</p>`;
    }
}

// Automatically fetch software jobs in London on page load
window.onload = () => searchJobs();

// Attach manual search function to button click
document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("query").value.trim();
    const location = document.getElementById("location").value.trim();
    searchJobs(query, location);
});




