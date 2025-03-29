function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("show");
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
async function searchJobs() {
    // Get user input (job title and location)
    const query = document.getElementById("query").value.trim();
    const location = document.getElementById("location").value.trim();
    
    // Ensure both job title and location are provided
    if (!query || !location) {
        document.getElementById("job-results").innerHTML = "<p>Please enter both job title and location.</p>";
        return;
    }

    try {
        // Fetch job listings from backend API
        const response = await fetch(`/api/jobs?query=${query}&location=${location}`);
        const data = await response.json();

        // If no jobs are found, display a user-friendly message
        if (data.message) {
            document.getElementById("job-results").innerHTML = `<p>${data.message}</p>`;
            return;
        }

        // If jobs are found, display them dynamically
        if (!data.results || data.results.length === 0) {
            throw new Error(`No job listings found in ${location}. Try searching in a different city.`);
        }

        document.getElementById("job-results").innerHTML = data.results.map(job => `
            <div class="job">
                <h3>${job.role}</h3>
                <p>${job.company_name} - ${job.location}</p>
                <a href="${job.url}" target="_blank">View Job</a>
            </div>
        `).join("");
    } catch (error) {
        console.error("❌ Job Search Error:", error.message);
        document.getElementById("job-results").innerHTML = `<p>${error.message}</p>`;
    }
}




/// Handle contact form submission
document.getElementById("contact-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    
    const formData = new FormData(this); // Collect form data
    formData.append("access_key", "f4053a9d-5d67-4b6c-a5ea-169a9dc8c0e0"); // API access key for Web3Forms

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        }).then(res => res.json());

        if (response.success) {
            Swal.fire("Success!", "Message sent successfully", "success"); // Show success alert
            this.reset();
        } else {
            Swal.fire("Error!", "Something went wrong", "error"); // Show error alert
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire("Error!", "Failed to send message", "error"); // Handle network errors
    }
});