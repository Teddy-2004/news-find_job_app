Techhire
Techhire is a web application that allows users to search for tech jobs by filtering with job title and location. It also provides the latest tech news from around the world. The app fetches job listings from Findwork.dev and news from NewsAPI.

Features
Tech News: View the latest tech-related news from various sources, filtered by category (e.g., technology, business, etc.).

Job Finder: Search for tech jobs by job title and location, with results fetched from Findwork.dev.

Tech Stack
Backend: Node.js with Express

API:

News: NewsAPI
Rate limiting
The API is limited to 100 requests per day.

Jobs: Findwork.dev
Rate limiting
The API is limited to 60 requests per minute.

Frontend: Static HTML files served via Express

Process Manager: PM2 (to run the app in the background)

Web Server: Nginx

Load Balancer: Custom load balancer (6405-lb-01) distributing traffic between 6405-web-01 and 6405-web-02

Setup Instructions
Clone the Repository

Clone the repository to your local machine:

bash
Copy
git clone https://github.com/Teddy-2004/techhire.git
cd techhire
Install Dependencies

Make sure you have Node.js installed (preferably the latest LTS version). Then, install the required dependencies:

bash
Copy
npm install
Set Up Environment Variables

You need to create a .env file in the root directory of the project to store your API keys:

NEWS_API_KEY: API key from NewsAPI

FINDWORK_API_KEY: API key from Findwork.dev

Example .env file:

ini
Copy
NEWS_API_KEY=your_news_api_key
FINDWORK_API_KEY=your_findwork_api_key
Start the Application

Run the application locally:

bash
Copy
node server.js
The app should now be running at http://localhost:5000.

Deployment Instructions
The app has been deployed to two servers (6405-web-01 and 6405-web-02) behind a load balancer (6405-lb-01) for high availability. The application uses Nginx for reverse proxying and PM2 to keep the Node.js app running in the background.

To deploy the app on your own server, follow these steps:

Install Dependencies on Your Server

Install Node.js (preferably LTS version).

Install PM2 globally:

bash
Copy
sudo npm install -g pm2
Clone the Repository on the Server

SSH into your server:

bash
Copy
ssh username@your-server-ip
Clone the repository:

bash
Copy
git clone https://github.com/your-username/techhire.git
cd techhire
Set Up the Environment File Create the .env file on your server with the same format as above.

Install Dependencies On the server, run:

bash
Copy
npm install
Start the Application with PM2 Run the app using PM2 to ensure it stays running even if the server reboots:

bash
Copy
pm2 start server.js
Configure Nginx (Optional) If you're using Nginx to serve the app, make sure your Nginx configuration points to the correct port. Example configuration for Nginx:

nginx
Copy
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
Reload Nginx:

bash
Copy
sudo service nginx reload
Configure Load Balancer (Optional) If you're using a load balancer, ensure that it distributes traffic between your servers (6405-web-01 and 6405-web-02) and correctly forwards requests to the appropriate Nginx or Node.js servers.

Usage
Tech News: You can view the latest tech news by visiting the root of the app (http://localhost:5000/).

Job Finder: Use the /api/jobs route to search for tech jobs by job title and location:

pgsql
Copy
GET /api/jobs?query=frontend&location=New York
This will return job listings matching the search query and location from Findwork.dev.

Environment Variables
The following environment variables are required:

NEWS_API_KEY: Your API key from NewsAPI.

FINDWORK_API_KEY: Your API key from Findwork.dev.

Example .env file:

ini
Copy
NEWS_API_KEY=your_news_api_key
FINDWORK_API_KEY=your_findwork_api_key
Troubleshooting
502 Bad Gateway: If you're using Nginx and receiving a 502 error, ensure that your Node.js application is running on the correct port (e.g., 5000) and that Nginx is correctly forwarding traffic to that port.

Missing Dependencies: If you encounter any missing dependencies, run:

bash
Copy
npm install
API Keys Missing: If you see errors about missing API keys, ensure that the .env file is properly set up and the keys are correct.

Contributing
Feel free to fork this repository, submit issues, and make pull requests. Contributions are always welcome!

License
This project is licensed under the MIT License - see the LICENSE file for details.

Notes:

Replace your_news_api_key and your_findwork_api_key with actual API keys from NewsAPI and Findwork.dev in your .env file.