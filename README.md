# FASHNOVA

### AI-Powered Fashion Intelligence Platform

FASHNOVA is a fashion intelligence platform that combines **Computer Vision, Machine Learning, Generative AI, and personalized recommendation systems** to understand fashion, analyze trends, generate creative concepts, and provide intelligent style recommendations.

The project is being developed as a production-oriented AI/ML system with a modular architecture designed for scalability, maintainability, and future deployment.

---

## ✨ Vision

FASHNOVA aims to build an intelligent fashion ecosystem where users can:

* Analyze fashion images using Computer Vision
* Understand clothing attributes and outfit characteristics
* Discover and analyze fashion trends
* Forecast emerging fashion trends using Machine Learning
* Generate fashion concepts and creative designs using Generative AI
* Receive personalized fashion recommendations
* Combine visual understanding, trend intelligence, and creative generation through a centralized Style Engine

---

# 🧠 Core Architecture

```text
                         FASHNOVA
                            │
             ┌──────────────┼──────────────┐
             │              │              │
          VISION          TRENDS        STUDIO
             │              │              │
       Computer Vision   ML Forecasting   Gen AI
             │              │              │
             └──────────────┼──────────────┘
                            │
                    STYLE ENGINE
                            │
                    Recommendation
                            │
                     FASHNOVA WEB APP
```

### Core Intelligence Pillars

#### 1. VISION — Computer Vision

The Vision module analyzes fashion images to identify visual and fashion-related attributes.

Planned capabilities include:

* Fashion image analysis
* Garment classification
* Clothing category detection
* Color analysis
* Pattern recognition
* Fit identification
* Style identification
* Season estimation
* Outfit analysis
* Fashion attribute extraction

---

#### 2. TRENDS — Machine Learning

The Trends module is responsible for understanding fashion trends and forecasting their evolution.

```text
Fashion Data
     ↓
Data Processing
     ↓
Feature Engineering
     ↓
Trend Detection
     ↓
ML Forecasting
     ↓
Trend Intelligence
     ↓
Style Engine
```

Planned capabilities include:

* Historical fashion trend analysis
* Seasonal trend analysis
* Trend detection
* Trend scoring
* Emerging trend identification
* Trend forecasting
* Fashion demand patterns
* Trend intelligence for recommendations

---

#### 3. STUDIO — Generative AI

Studio is FASHNOVA's creative intelligence layer.

It is designed to generate fashion-related creative concepts rather than directly acting as the recommendation engine.

Planned capabilities include:

* Fashion concept generation
* Design generation
* Pattern generation
* Graphic generation
* Style variations
* Trend-aware creative generation
* Creative fashion exploration

---

#### 4. STYLE ENGINE — Recommendation Intelligence

The Style Engine is the central intelligence layer of FASHNOVA.

It combines:

```text
VISION
  +
TRENDS
  +
STUDIO
  +
USER PROFILE
  +
USER CONTEXT
        ↓
   STYLE ENGINE
        ↓
 RECOMMENDATIONS
```

The Style Engine will be responsible for:

* Recommendation scoring
* Recommendation ranking
* Personalization
* Context-aware recommendations
* Combining visual and trend signals
* Learning from user feedback
* Improving recommendations over time

The recommendation logic will remain on the backend rather than being implemented inside the frontend.

---

# 🏗️ Current System Architecture

FASHNOVA currently follows a modular full-stack architecture:

```text
┌──────────────────────────────────────────┐
│             FASHNOVA WEB APP             │
│              React + Vite                │
└───────────────────┬──────────────────────┘
                    │
                    │ REST API
                    ↓
┌──────────────────────────────────────────┐
│              BACKEND API                 │
│          Node.js + Express               │
│                                          │
│  Auth │ Profile │ Vision │ Style Engine  │
└───────────────┬───────────────┬──────────┘
                │               │
                │               │
                ↓               ↓
        ┌──────────────┐  ┌──────────────┐
        │ PostgreSQL   │  │  ML Services │
        │   + Prisma   │  │    Python    │
        └──────────────┘  └──────┬───────┘
                                 │
                                 ↓
                         Computer Vision
                              Models
```

---

# 🛠️ Technology Stack

## Frontend

* React
* Vite
* JavaScript
* React Router
* CSS
* ESLint

## Backend

* Node.js
* Express 5
* REST APIs
* Zod validation
* JWT authentication
* bcryptjs
* CORS
* Multer

## Database

* PostgreSQL
* Prisma ORM
* Prisma PostgreSQL adapter

## Machine Learning

* Python
* FastAPI
* PyTorch
* Torchvision
* Hugging Face Transformers
* Pillow

## Computer Vision

Current Vision model direction:

**AutoCatalogAI CLIP Multitask Classifier V2**

Based on:

* CLIP ViT-B/32
* Multi-task classification
* Fashion attribute prediction
* Hierarchical classification
* Color feature branch

The selected model is being integrated into FASHNOVA's Vision service and is not yet considered production-ready.

## Development

* VS Code
* Git
* GitHub
* Python virtual environments
* npm

---

# 📁 Project Structure

```text
FASHNOVA/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   │   └── vision/
│   │   ├── middleware/
│   │   ├── routes/
│   │   │   └── vision/
│   │   ├── services/
│   │   │   └── vision/
│   │   ├── validators/
│   │   │   └── vision/
│   │   └── utils/
│   │
│   ├── .env.example
│   ├── package.json
│   └── prisma7.config.ts
│
├── frontend/
│   ├── public/
│   │   └── logo.png
│   │
│   └── src/
│       ├── components/
│       ├── config/
│       ├── context/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Vision.jsx
│       │   ├── Trends.jsx
│       │   ├── Studio.jsx
│       │   ├── Profile.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       └── services/
│
├── ml/
│   ├── vision/
│   │   ├── app/
│   │   │   └── main.py
│   │   ├── models/
│   │   │   └── clip_multitask.py
│   │   ├── services/
│   │   │   └── model_service.py
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   └── README.md
│   │
│   └── pyproject.toml
│
├── data/
│
├── models/
│
├── notebooks/
│
├── docs/
│
├── tests/
│
├── .gitignore
└── README.md
```

---

# 🚀 Implemented So Far

## Project Foundation

* [x] FASHNOVA project initialized
* [x] Core architecture defined
* [x] Vision / Trends / Studio / Style Engine architecture established
* [x] Production-oriented folder structure established
* [x] Git repository initialized
* [x] GitHub repository connected
* [x] Initial project checkpoint pushed to GitHub

## Frontend

* [x] React + Vite application
* [x] React Router integration
* [x] FASHNOVA navigation
* [x] FASHNOVA logo integrated
* [x] Home page
* [x] Vision page
* [x] Trends page foundation
* [x] Studio page foundation
* [x] Profile page foundation
* [x] Login page
* [x] Registration page
* [x] Authentication context
* [x] Vision upload interface
* [x] Vision analysis status interface
* [x] Responsive styling for Vision
* [x] AI/ML-first product presentation

## Backend

* [x] Node.js + Express backend
* [x] Environment configuration
* [x] Environment validation using Zod
* [x] PostgreSQL integration
* [x] Prisma integration
* [x] Authentication APIs
* [x] JWT authentication
* [x] Password hashing
* [x] Profile API foundation
* [x] Global error handling
* [x] Request validation middleware
* [x] Vision routes
* [x] Vision image upload endpoint
* [x] Image type validation
* [x] Image size limits
* [x] Vision analysis endpoint
* [x] Vision ML service communication

## Database

The initial database layer has been established using PostgreSQL and Prisma.

Current Vision-related entities include:

```text
FashionItem
     │
     └── FashionImage
             │
             └── VisionAnalysis
```

Vision analysis records support:

* Analysis status
* Model name
* Model version
* Category
* Pattern
* Fit
* Style
* Season
* Dominant color
* Confidence
* Additional attributes
* Error information
* Processing timestamps

This structure is designed to support model versioning and future ML improvements.

---

# 👁️ Vision Pipeline — Current Status

The current end-to-end Vision development flow is:

```text
User
 ↓
Upload Fashion Image
 ↓
React Frontend
 ↓
Node.js Backend
 ↓
Store Image
 ↓
Create FashionItem
 ↓
Create FashionImage
 ↓
Create VisionAnalysis
 ↓
Call Python Vision Service
 ↓
Vision ML Processing
 ↓
Return Analysis
 ↓
Frontend Result
```

The current pipeline is functional for **upload → database record → ML service communication**.

The actual trained model inference and database update of final predictions are still being implemented.

Therefore, FASHNOVA does **not** currently claim that real production-level fashion predictions are available.

---

# 🤖 Vision ML Model

The current model integration is based on a custom multi-task architecture built around:

```text
CLIP ViT-B/32
      │
      ├── Gender
      ├── Master Category
      ├── Sub Category
      ├── Article Type
      ├── Base Colour
      ├── Season
      └── Usage
```

The architecture also includes hierarchical relationships between classification tasks:

```text
Master Category
       ↓
   Sub Category
       ↓
   Article Type
      ↙   ↘
 Season   Usage
```

A dedicated color branch is also included for base-color classification.

The model checkpoint has been successfully downloaded and the reconstructed PyTorch architecture has been successfully loaded for development.

---

# 🔐 Security & Configuration

Sensitive configuration is intentionally excluded from Git.

Examples include:

* Database credentials
* JWT secrets
* Local environment variables
* Uploaded user images
* Python virtual environments
* Node modules
* Model artifacts
* Local development tooling

A `.env.example` file is provided as a configuration template.

---

# 🧪 Testing Strategy

FASHNOVA is being developed with testing and validation as part of the architecture rather than as an afterthought.

Planned testing layers:

```text
Unit Tests
    ↓
Service Tests
    ↓
API Tests
    ↓
ML Model Tests
    ↓
Integration Tests
    ↓
End-to-End Tests
```

Future Vision evaluation will include:

* Classification accuracy
* Precision
* Recall
* F1-score
* Confidence analysis
* Error analysis
* Model latency
* CPU/GPU performance
* Domain-shift evaluation

---

# 📌 Development Status

### Overall Project

**Phase: Foundation + Core Vision Pipeline**

| Module                 | Status         |
| ---------------------- | -------------- |
| Project Architecture   | 🟢 Established |
| Frontend Foundation    | 🟢 Implemented |
| Authentication         | 🟢 Implemented |
| Database Foundation    | 🟢 Implemented |
| Backend Foundation     | 🟢 Implemented |
| Vision Upload          | 🟢 Implemented |
| Vision API             | 🟢 Implemented |
| Vision ML Service      | 🟡 In Progress |
| Vision Model Inference | 🟡 In Progress |
| Trends ML              | 🔵 Planned     |
| Studio GenAI           | 🔵 Planned     |
| Style Engine           | 🔵 Planned     |
| Recommendation System  | 🔵 Planned     |
| Production Deployment  | 🔵 Planned     |

### Status Legend

* 🟢 Implemented
* 🟡 In Progress
* 🔵 Planned

---

# 🗺️ Development Roadmap

## Phase 1 — Foundation

* [x] Project architecture
* [x] Technology stack
* [x] Repository structure
* [x] Frontend foundation
* [x] Backend foundation
* [x] Database foundation

## Phase 2 — Vision

* [x] Vision UI
* [x] Image upload
* [x] Image storage
* [x] Vision database entities
* [x] Vision API
* [x] Python Vision service
* [x] Model architecture reconstruction
* [x] Model checkpoint loading
* [ ] Real model inference
* [ ] Prediction normalization
* [ ] Vision database result updates
* [ ] Vision evaluation
* [ ] Production hardening

## Phase 3 — Trends

* [ ] Fashion dataset pipeline
* [ ] Data cleaning
* [ ] Feature engineering
* [ ] Trend detection
* [ ] Trend scoring
* [ ] Historical analysis
* [ ] Seasonal analysis
* [ ] ML forecasting
* [ ] Trend API
* [ ] Trends UI

## Phase 4 — Studio

* [ ] GenAI architecture
* [ ] Fashion concept generation
* [ ] Design generation
* [ ] Pattern generation
* [ ] Graphic generation
* [ ] Style variation generation
* [ ] Trend-aware generation
* [ ] Studio API
* [ ] Studio UI

## Phase 5 — Style Engine

* [ ] User preference modeling
* [ ] Vision signal integration
* [ ] Trend signal integration
* [ ] Studio signal integration
* [ ] Recommendation scoring
* [ ] Recommendation ranking
* [ ] Personalization
* [ ] Feedback loop
* [ ] Recommendation API

## Phase 6 — Integration

* [ ] Connect Vision → Style Engine
* [ ] Connect Trends → Style Engine
* [ ] Connect Studio → Style Engine
* [ ] Connect user profile → Style Engine
* [ ] Complete recommendation workflow
* [ ] End-to-end testing

## Phase 7 — Evaluation & Deployment

* [ ] Backend testing
* [ ] ML evaluation
* [ ] Integration testing
* [ ] Security testing
* [ ] Performance testing
* [ ] Production configuration
* [ ] Deployment
* [ ] Monitoring
* [ ] Documentation

---

# 💻 Local Development

## Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on the configured backend port, currently:

```text
http://localhost:5000
```

Health endpoint:

```text
/api/health
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is served by Vite.

---

## Vision ML Service

Create/activate the Vision virtual environment and install dependencies:

```bash
cd ml/vision
pip install -r requirements.txt
```

Start the FastAPI service:

```bash
uvicorn ml.vision.app.main:app --reload --port 8000
```

The Vision ML service runs at:

```text
http://127.0.0.1:8000
```

Health endpoint:

```text
/health
```

---

# 🌐 Repository

The source code is maintained on GitHub:

**PDisha-01/FASHNOVA**

The repository contains the current project foundation, frontend, backend, database schema/migrations, and Vision ML development structure.

---

# ⚠️ Current Limitations

FASHNOVA is currently under active development.

At the current stage:

* The Vision ML service is still being integrated.
* Real Vision inference is not yet fully connected to the database workflow.
* Trend forecasting has not yet been implemented.
* Studio's GenAI pipeline has not yet been implemented.
* The Style Engine has not yet been implemented.
* Production object storage has not yet been configured.
* Production deployment has not yet been completed.
* ML models are currently being developed/evaluated on CPU during local development.

These limitations are expected at the current development phase.

---

# 🎯 Project Goal

FASHNOVA is being developed beyond a basic CRUD or AI-demo application.

The long-term goal is to build a complete fashion intelligence pipeline:

```text
Fashion Image
      ↓
Computer Vision
      ↓
Fashion Understanding
      ↓
        ┌───────────────┐
        │               │
        ↓               ↓
   Trend ML         GenAI Studio
        │               │
        └───────┬───────┘
                ↓
          STYLE ENGINE
                ↓
       Personalization
                ↓
       Recommendations
                ↓
          FASHNOVA
```

The system is designed so that each intelligence layer contributes meaningful information to the final recommendation experience.

---

# 📄 License

License information will be added as the project approaches its release/deployment stage.

---

## 🚧 Development

FASHNOVA is currently under active development.

The architecture, database, backend, AI/ML services, and frontend are being developed incrementally with emphasis on:

* Clean architecture
* Modularity
* Validation
* Error handling
* Model versioning
* Testing
* Security
* Maintainability
* Deployment readiness
* Scalable AI/ML integration
