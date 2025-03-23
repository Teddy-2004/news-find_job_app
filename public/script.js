document.getElementById('scrollButton').addEventListener('click', function() {
    // Scroll to section4
    const section4 = document.getElementById('section4');
    section4.scrollIntoView({ behavior: 'smooth' });
  });
  

// Tab Navigation
function showTab(tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    
    document.getElementById(tabName).classList.add("active");
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add("active");
}

// Fetch News
async function fetchNews() {
    try {
        const response = await fetch("/api/news");
        const data = await response.json();
        document.getElementById("news-results").innerHTML = data.articles.map(article => `
            <div class="news">
                <h3>${article.title}</h3>
                <p>${article.source.name}</p>
                <a href="${article.url}" target="_blank">Read More</a>
            </div>
        `).join("");
    } catch (error) {
        document.getElementById("news-results").innerHTML = "<p>Error fetching news.</p>";
    }
}

// Search Jobs
async function searchJobs() {
    const query = document.getElementById("query").value;
    const location = document.getElementById("location").value;
    
    try {
        const response = await fetch(`/api/jobs?query=${query}&location=${location}`);
        const data = await response.json();
        document.getElementById("job-results").innerHTML = data.results.map(job => `
            <div class="job">
                <h3>${job.role}</h3>
                <p>${job.company_name} - ${job.location}</p>
                <a href="${job.url}" target="_blank">View Job</a>
            </div>
        `).join("");
    } catch (error) {
        document.getElementById("job-results").innerHTML = "<p>Error fetching jobs.</p>";
    }
}
