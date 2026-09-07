# FASHNOVA

### AI-Powered Fashion Intelligence Platform

FASHNOVA is a fashion intelligence platform that combines **Computer Vision, Machine Learning, Generative AI, and personalized recommendation systems** to understand fashion, analyze trends, generate creative designs, and provide intelligent style recommendations.

The project is being developed as a production-oriented AI/ML system with a modular architecture designed for scalability, maintainability, validation, and future deployment.

---

# ✨ Vision

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
          VISION          TRENDS         STUDIO
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

## Core Intelligence Pillars

### 1. VISION — Computer Vision

The Vision module analyzes fashion images and extracts structured fashion attributes.

Current model integration is based on:

**AutoCatalogAI CLIP Multitask Classifier V2**

The current prediction pipeline includes:

* Gender
* Master Category
* Sub Category
* Article Type
* Base Colour
* Season
* Usage

The Vision pipeline connects:

```text
Fashion Image
      ↓
React Frontend
      ↓
Node.js Backend
      ↓
Python Vision Service
      ↓
CLIP Multitask Model
      ↓
Fashion Attributes
      ↓
Frontend Result
```

---

### 2. TRENDS — Machine Learning

The Trends module provides fashion trend intelligence using a real fashion catalog dataset and a structured ML pipeline.

```text
Fashion Data
     ↓
Data Cleaning
     ↓
Normalized Yearly Shares
     ↓
Feature Engineering
     ↓
Trend Detection
     ↓
Trend Scoring
     ↓
ML Forecasting
     ↓
Trend Intelligence
     ↓
Style Engine
```

Current capabilities include:

* Historical trend analysis
* Emerging trend detection
* Trend lifecycle classification
* Trend scoring
* Color trend intelligence
* Category momentum
* Sub-category analysis
* Trend forecasting
* Forecast validation
* Forecast confidence estimation
* Trend filtering and comparison

Trend signals are normalized across years rather than treating raw catalog counts as direct popularity measurements.

---

### 3. STUDIO — Generative AI

Studio is FASHNOVA's creative intelligence layer.

It is responsible for generating fashion-related creative outputs rather than directly acting as the recommendation engine.

Current Studio architecture:

```text
React Studio
     ↓
Node.js Backend
     ↓
Python Studio Service
     ↓
Prompt Builder
     ↓
Gemini Image Generation API
     ↓
Generated Fashion Design
```

Current capabilities include:

* Structured fashion generation requests
* Fashion context conditioning
* Trend-context interface
* Vision-context interface
* Prompt construction
* AI design generation
* Image response handling
* Generation validation
* Error handling

The current implemented generation workflow is:

**Design Generation**

The architecture is prepared for future:

* Concept generation
* Pattern generation
* Style variations
* Reference-based generation
* Additional trend-aware generation workflows

---

### 4. STYLE ENGINE — Recommendation Intelligence

The Style Engine is the central intelligence layer of FASHNOVA.

It will combine:

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
* Using Studio-generated creative signals
* Learning from user feedback
* Improving recommendations over time

Recommendation logic will remain on the backend rather than being implemented inside the frontend.

---

# 🏗️ System Architecture

FASHNOVA follows a modular full-stack architecture.

```text
┌──────────────────────────────────────────────┐
│               FASHNOVA WEB APP               │
│                 React + Vite                 │
└──────────────────────┬───────────────────────┘
                       │
                       │ REST API
                       ↓
┌──────────────────────────────────────────────┐
│                 BACKEND API                  │
│              Node.js + Express               │
│                                              │
│ Auth │ Profile │ Vision │ Trends │ Studio   │
│              │ Style Engine                  │
└──────────────┬───────────────────┬───────────┘
               │                   │
               ↓                   ↓
       ┌──────────────┐    ┌────────────────────┐
       │ PostgreSQL   │    │  Python ML Services │
       │   + Prisma   │    │                    │
       └──────────────┘    │ Vision   :8000     │
                           │ Trends   :8001     │
                           │ Studio   :8002     │
                           └────────────────────┘
```

The Node.js backend acts as the integration boundary between:

* Frontend
* Database
* Vision ML service
* Trends ML service
* Studio GenAI service
* Future Style Engine

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
* Axios
* Zod validation
* JWT authentication
* bcryptjs
* CORS
* Multer

## Database

* PostgreSQL
* Prisma ORM
* Prisma PostgreSQL adapter

## Machine Learning & AI

* Python
* FastAPI
* PyTorch
* Torchvision
* Hugging Face Transformers
* Pillow
* scikit-learn
* Google GenAI SDK

## Computer Vision

**AutoCatalogAI CLIP Multitask Classifier V2**

Based on:

* CLIP ViT-B/32
* Multi-task classification
* Fashion attribute prediction
* Hierarchical classification
* Color feature branch

## Trends ML

The Trends ML pipeline includes:

* Dataset processing
* Feature engineering
* Trend detection
* Trend scoring
* Trend lifecycle analysis
* Forecasting
* Forecast validation
* Confidence estimation

## Studio GenAI

Studio uses a hosted image-generation model through the Google GenAI API.

The architecture intentionally keeps large generative models outside the local machine so that the project can run on hardware without a dedicated NVIDIA GPU.

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
│   │   │   ├── vision/
│   │   │   ├── trends/
│   │   │   └── studio/
│   │   ├── middleware/
│   │   ├── routes/
│   │   │   ├── vision/
│   │   │   ├── trends/
│   │   │   └── studio/
│   │   ├── services/
│   │   │   ├── vision/
│   │   │   ├── trends/
│   │   │   └── studio/
│   │   ├── validators/
│   │   │   ├── vision/
│   │   │   └── studio/
│   │   └── utils/
│   │
│   ├── .env.example
│   └── package.json
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
│   │   ├── models/
│   │   ├── inference/
│   │   ├── preprocessing/
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   └── README.md
│   │
│   ├── trends/
│   │   ├── app/
│   │   ├── data/
│   │   ├── features/
│   │   ├── detection/
│   │   ├── forecasting/
│   │   ├── scoring/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   └── README.md
│   │
│   └── studio/
│       ├── app/
│       ├── conditioning/
│       ├── generation/
│       ├── prompting/
│       ├── schemas/
│       ├── services/
│       ├── tests/
│       ├── requirements.txt
│       └── README.md
│
├── data/
├── models/
├── notebooks/
├── docs/
├── tests/
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
* [x] Development checkpoints committed

## Frontend

* [x] React + Vite application
* [x] React Router integration
* [x] FASHNOVA navigation
* [x] FASHNOVA logo integrated
* [x] Home page
* [x] Vision page
* [x] Trends page
* [x] Studio page
* [x] Profile page foundation
* [x] Login page
* [x] Registration page
* [x] Authentication context
* [x] Vision upload interface
* [x] Vision analysis result interface
* [x] Trends intelligence interface
* [x] Studio generation workspace
* [x] Responsive styling for core pages
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
* [x] Vision analysis endpoint
* [x] Vision ML service communication
* [x] Trends API
* [x] Trends ML service communication
* [x] Studio API
* [x] Studio request validation
* [x] Studio ML service communication

## Trends ML

* [x] Fashion dataset ingestion
* [x] Data cleaning
* [x] Normalized yearly trend signals
* [x] Feature engineering
* [x] Trend detection
* [x] Trend lifecycle classification
* [x] Trend scoring
* [x] ML forecasting
* [x] Forecast validation
* [x] Forecast confidence estimation
* [x] Trends FastAPI service
* [x] Trends backend integration
* [x] Trends frontend integration

## Studio GenAI

* [x] Studio Python service structure
* [x] Studio request/response schemas
* [x] Prompt builder
* [x] Fashion context conditioning
* [x] Trend context interface
* [x] Vision context interface
* [x] Gemini GenAI service integration
* [x] Design generation workflow
* [x] Studio FastAPI service
* [x] Studio backend API
* [x] Studio frontend workspace
* [x] Studio backend → ML connection
* [x] Generation validation and error handling
* [ ] Concept generation workflow
* [ ] Pattern generation workflow
* [ ] Style variation generation workflow
* [ ] Production image storage

---

# 👁️ Vision Pipeline

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
Return Fashion Attributes
 ↓
Frontend Result
```

The current Vision pipeline is functional for local development.

The model produces structured predictions for:

* Gender
* Master Category
* Sub Category
* Article Type
* Base Colour
* Season
* Usage

---

# 📈 Trends Pipeline

```text
Fashion Dataset
       ↓
Data Loading
       ↓
Cleaning
       ↓
Yearly Normalization
       ↓
Feature Engineering
       ↓
Trend Detection
       ↓
Trend Scoring
       ↓
Forecasting
       ↓
FastAPI
       ↓
Node.js Backend
       ↓
Trends UI
```

The Trends service runs independently from the Node.js backend and communicates through an HTTP API.

---

# 🎨 Studio Pipeline

```text
User Prompt
     ↓
Studio UI
     ↓
Node.js Backend
     ↓
Studio Python Service
     ↓
Request Validation
     ↓
Prompt Builder
     ↓
Fashion Context
     ↓
Trend / Vision Context
     ↓
Gemini Image Generation
     ↓
Generated Image
     ↓
Backend Response
     ↓
Studio UI
```

Studio is designed as a genuine GenAI service rather than a frontend-only simulation.

---

# 🔐 Security & Configuration

Sensitive configuration is intentionally excluded from Git.

Examples include:

* Database credentials
* JWT secrets
* Gemini API keys
* Local environment variables
* Uploaded user images
* Python virtual environments
* Node modules
* Model artifacts
* Local development tooling

A `.env.example` file should be used as a configuration template.

**Never commit API keys or `.env` files containing secrets.**

---

# 🧪 Testing Strategy

FASHNOVA is being developed with testing and validation as part of the architecture.

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

Future evaluation will include:

* Classification accuracy
* Precision
* Recall
* F1-score
* Confidence analysis
* Error analysis
* Forecast validation
* Model latency
* CPU/GPU performance
* Domain-shift evaluation
* API reliability
* End-to-end workflow validation

---

# 📌 Development Status

### Overall Project

**Phase: Core Intelligence Modules Completed — Style Engine Next**

| Module                    | Status         |
| ------------------------- | -------------- |
| Project Architecture      | 🟢 Established |
| Frontend Foundation       | 🟢 Implemented |
| Authentication            | 🟢 Implemented |
| Database Foundation       | 🟢 Implemented |
| Backend Foundation        | 🟢 Implemented |
| Vision                    | 🟢 Implemented |
| Vision ML Service         | 🟢 Implemented |
| Trends ML                 | 🟢 Implemented |
| Trends API                | 🟢 Implemented |
| Trends UI                 | 🟢 Implemented |
| Studio GenAI Architecture | 🟢 Implemented |
| Studio API                | 🟢 Implemented |
| Studio UI                 | 🟢 Implemented |
| Studio ML Service         | 🟢 Implemented |
| Style Engine              | 🔵 Next        |
| Recommendation System     | 🔵 Planned     |
| End-to-End Integration    | 🔵 Planned     |
| Production Deployment     | 🔵 Planned     |

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
* [x] Model inference integration
* [x] Prediction normalization
* [x] Vision result handling
* [ ] Broader model evaluation
* [ ] Production hardening

## Phase 3 — Trends

* [x] Fashion dataset pipeline
* [x] Data cleaning
* [x] Feature engineering
* [x] Trend detection
* [x] Trend lifecycle classification
* [x] Trend scoring
* [x] Historical analysis
* [x] Seasonal signal support
* [x] ML forecasting
* [x] Forecast validation
* [x] Forecast confidence estimation
* [x] Trend API
* [x] Trends UI

## Phase 4 — Studio

* [x] GenAI architecture
* [x] Fashion generation schema
* [x] Prompt construction
* [x] Fashion context conditioning
* [x] Trend-aware conditioning interface
* [x] Vision-aware conditioning interface
* [x] Design generation workflow
* [x] Gemini image-generation integration
* [x] Studio API
* [x] Studio UI
* [ ] Concept generation workflow
* [ ] Pattern generation workflow
* [ ] Style variation generation workflow
* [ ] Production image storage

## Phase 5 — Style Engine

* [ ] User preference modeling
* [ ] Vision signal integration
* [ ] Trend signal integration
* [ ] Studio signal integration
* [ ] Recommendation feature engineering
* [ ] Recommendation scoring
* [ ] Recommendation ranking
* [ ] Personalization
* [ ] Context-aware recommendations
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
* [ ] Object/image storage
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

Backend:

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

The frontend is served using Vite.

---

## Vision ML Service

From the FASHNOVA project root:

```bash
uvicorn ml.vision.app.main:app --host 127.0.0.1 --port 8000
```

Service:

```text
http://127.0.0.1:8000
```

Health endpoint:

```text
/health
```

---

## Trends ML Service

From the FASHNOVA project root:

```bash
uvicorn ml.trends.app.main:app --host 127.0.0.1 --port 8001
```

Service:

```text
http://127.0.0.1:8001
```

Health endpoint:

```text
/health
```

Analysis endpoint:

```text
/analyze
```

---

## Studio ML Service

From the FASHNOVA project root:

```bash
uvicorn ml.studio.app.main:app --host 127.0.0.1 --port 8002
```

Service:

```text
http://127.0.0.1:8002
```

Health endpoint:

```text
/health
```

Generation endpoint:

```text
/generate
```

Studio actual image generation requires a configured `GEMINI_API_KEY` in the local `ml/studio/.env` file.

API credentials must never be committed to Git.

---

# 🌐 Repository

The source code is maintained on GitHub:

**PDisha-01/FASHNOVA**

The repository contains:

* Frontend application
* Node.js backend
* PostgreSQL/Prisma database layer
* Vision ML service
* Trends ML service
* Studio GenAI service
* Project documentation

---

# ⚠️ Current Limitations

FASHNOVA is currently under active development.

At the current stage:

* Vision, Trends, and Studio are implemented for local development.
* Vision and Trends use dedicated Python FastAPI services behind the Node.js backend.
* Studio uses a hosted GenAI image-generation provider and requires appropriate API quota/project configuration for actual image generation.
* Studio currently has the design generation workflow implemented; additional generation types remain future work.
* The Style Engine has not yet been implemented.
* Production object storage has not yet been configured.
* Production deployment has not yet been completed.
* Broader ML evaluation and production hardening remain future work.
* ML services are currently developed and tested locally.

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
       ┌───────────────────┐
       │                   │
       ↓                   ↓
  Trend ML           GenAI Studio
       │                   │
       └─────────┬─────────┘
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
