<div align="center">

# 👷 Labor Connect

<img src="docs/assets/hero-banner.png" alt="Labor Connect Hero Banner" width="100%">

**A modern, real-time platform connecting skilled manual workers with job providers.**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=nodedotjs&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?logo=vite&logoColor=white)](#)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?logo=socketdotio&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](#)

</div>

---

## 📖 Overview

**Labor Connect** is a dual-sided marketplace designed to bridge the gap between people who need work done (Job Providers) and skilled blue-collar professionals (Workers). 

Whether you need a plumber, electrician, carpenter, or a helper for the day, Labor Connect makes it effortless to find, hire, and communicate with nearby talent.

## ✨ Features

### For Job Providers (Employers)
- 🔍 **Search & Filter:** Find nearby workers based on skills, category, and distance using real-time geolocation.
- 💼 **Job Creation:** Post detailed job requirements, expected wages, and location details.
- 🤖 **AI Assistant Chatbot:** Use natural language to instantly find workers, estimate costs, or check weather conditions at the job site.
- 💬 **Real-time Chat:** Communicate instantly with hired workers using WebSocket connections.
- ⭐ **Rating System:** Rate and review workers after a job is completed.

### For Workers
- 📱 **Interactive Dashboard:** Track daily earnings, upcoming jobs, and rating scores.
- 📍 **Live Location Tracking:** Get discovered easily by employers based on your current live location or worksite.
- 🏆 **Leveling System:** Earn XP and climb the ranks from Bronze 🥉 to Platinum 💎 by completing jobs and maintaining a high attendance score.
- 💬 **AI Assistant:** Check your earnings and incoming requests quickly with Voice-to-Text capabilities.

---

## 🚀 Tech Stack

### Frontend
* **React 18** (Vite)
* **Axios** for API communication
* **React Router Dom** for client-side routing
* **Socket.IO-Client** for real-time WebSockets
* **Leaflet & React-Leaflet** for interactive maps
* **Chart.js** for earnings & analytics visualization

### Backend
* **Node.js & Express**
* **Sequelize ORM** (MySQL / SQLite support)
* **Socket.IO** for real-time messaging and notifications
* **JWT** for secure Authentication

---

## 🐳 Docker Setup (Recommended)

Running the backend and database locally is fully automated with Docker Compose.

**Prerequisites:** Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your machine.

1. **Start the Database and Server:**
   ```bash
   docker-compose up -d --build
   ```
   This command automatically provisions a **MySQL 8.0** database and builds your **Node.js** server container. The API will be available at `http://localhost:5000`.

2. **Start the Frontend:**
   Open a new terminal window, navigate to the `client` directory, and start the Vite dev server:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The web app will be available at `http://localhost:5173`.

---

## ☁️ Deployment

### Deploying the Frontend (Vercel)
This project is configured out-of-the-box for **Vercel** deployment:
1. Push your repository to GitHub.
2. Import the project in Vercel and select the `client` directory as the Root Directory.
3. Vercel will auto-detect the Vite framework.
4. Add the `VITE_API_URL` environment variable in Vercel (e.g. `https://your-backend-api.com/api`).
5. Deploy!

### Deploying the Backend (Render / Railway)
Because the backend relies on **WebSockets (Socket.IO)** for real-time chat, it cannot be hosted on Serverless platforms like Vercel Functions. 

Deploy the backend to container-friendly services like **Render**, **Railway**, or **Fly.io**. These platforms natively support `docker-compose.yml` and `Dockerfile`, making deployment seamless.

---

## 🤖 The AI Assistant Chatbot

Labor Connect comes with an integrated conversational AI chatbot with quick-action buttons and voice recognition!

**Example Commands (Employer):**
* `"Find electricians near me"`
* `"Estimate cost for a plumber"`
* `"Show available workers"`

**Example Commands (Worker):**
* `"Show my earnings"`
* `"Find jobs"`
* `"Check my level"`

---

<div align="center">
  Made with ❤️ by the Labor Connect Team
</div>
