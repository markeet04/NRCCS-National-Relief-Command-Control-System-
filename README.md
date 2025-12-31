# 🌊 NRCCS - National Relief Command & Control System

[![Azure Deployment](https://img.shields.io/badge/Deployment-Azure-blue.svg)](https://azure.microsoft.com/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-red.svg)](https://docs.nestjs.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/AI-Python-3776AB.svg)](https://www.python.org/)

**NRCCS** is a critical, multi-tier disaster management platform designed to streamline flood prediction, resource allocation, and emergency response across National, Provincial, and District levels.

> [!NOTE]
> This project was developed by students of **Air University Islamabad** as part of our academic work and is not a licensed commercial product.

---

## 🚀 Key Features

### 🏛️ Tiered Command Centers
- **NDMA Dashboard**: National-level oversight, strategic flood mapping, and high-level resource distribution.
- **PDMA Dashboard**: Provincial-level coordination between districts, shelter management, and provincial alerts.
- **District Portal**: Micro-level disaster response, SOS request management, rescue team deployment, and missing persons tracking.

### 🤖 AI-Powered Flood Prediction
- **Machine Learning Integration**: Uses a trained Random Forest model to predict flood risk based on 24h/48h rainfall, temperature, and humidity.
- **Deductive Reasoning**: Smart resource allocation system that suggests the best relief items (boats, food, medicine) based on population density and risk levels.

### 📱 Public Safety & Reporting
- **Civilian Portal**: Public alerts, reporting of missing persons, and SOS signaling.
- **Interactive Mapping**: Geographic visualization of flood zones and relief centers across Pakistan.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite), Tailwind CSS, Framer Motion (Animations), Leaflet/ArcGIS (Maps).
- **Backend**: NestJS, TypeORM, PostgreSQL, Passport (Auth), Express Session.
- **AI/ML**: Python 3, Scikit-learn, Pickle (Model Serialization).
- **Infrastructure**: Docker, Docker Compose, Azure Container Apps.

---

## 📁 Project Structure

```text
├── backend/nrccs/     # NestJS API, Business Logic, and AI Sub-process
├── frontend/          # React Vite Application, Dashboards, and UI
├── Artiint/           # Original AI Training Code and Datasets
├── docker-compose.yml # Full-stack orchestration
└── build-docker.ps1  # Automated build script for Docker images
```

---

## 🚦 Getting Started

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [PostgreSQL](https://www.postgresql.org/) (if running without Docker)
- [Python 3.9+](https://www.python.org/) (for AI features)

### 1. Clone the Project
```bash
git clone https://github.com/markeet04/NRCCS-National-Relief-Command-Control-System-.git
cd NRCCS-National-Relief-Command-Control-System-
```

### 2. Run with Docker (Recommended)
The easiest way to get the full stack running (Database + Backend + Frontend) is using Docker Compose:

```bash
docker-compose up --build
```
- **Frontend**: [http://localhost:5173](http://localhost:5173) (mapped internally to port 80 in Docker)
- **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)

### 3. Manual Installation (Development)

#### Backend Setup
```bash
cd backend/nrccs
npm install
# Create .env based on .env.example
npm run start:dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment

This project is optimized for **Azure Container Apps**. For official guidance on deploying containerized applications to Azure, refer to the:
- [Official Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)

---

---
*Made with ❤️ for humanity*
