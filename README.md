# FASHNOVA

### AI-Powered Fashion Intelligence Platform

FASHNOVA is an AI-powered fashion intelligence platform that combines **Computer Vision, Machine Learning, Generative AI, and personalized recommendation systems** to understand fashion, analyze trends, generate creative designs, and provide intelligent style recommendations.

The project is being developed as a modular, production-oriented AI/ML system with clear service boundaries, structured APIs, database integration, validation, error handling, testing, and future deployment readiness.

---

# ✨ Vision

FASHNOVA aims to build an intelligent fashion ecosystem where users can:

* Analyze fashion images using Computer Vision
* Understand clothing attributes and outfit characteristics
* Discover and analyze fashion trends
* Forecast emerging fashion trends using Machine Learning
* Generate fashion concepts and creative designs using Generative AI
* Maintain personalized fashion preferences
* Receive intelligent style recommendations
* Combine visual understanding, trend intelligence, and creative generation through a centralized Style Engine

The long-term goal is to transform fashion discovery from a simple browsing experience into an intelligent, personalized fashion intelligence system.

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
                     Core Intelligence Pillars
1. VISION — Computer Vision

The Vision module analyzes fashion images and extracts structured fashion attributes.

Current model integration is based on:

AutoCatalogAI CLIP Multitask Classifier V2

The current prediction pipeline includes:

Gender
Master Category
Sub Category
Article Type
Base Colour
Season
Usage

The Vision pipeline connects:

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

The Vision service is implemented as an independent FastAPI service so that model inference remains separated from the main Node.js application.

2. TRENDS — Machine Learning

The Trends module provides fashion trend intelligence using a fashion catalog dataset and a structured machine-learning pipeline.

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

Current Trends capabilities include:

Historical trend analysis
Emerging trend detection
Trend lifecycle classification
Trend scoring
Color trend intelligence
Category momentum
Sub-category analysis
Trend forecasting
Forecast validation
Forecast confidence estimation
Trend filtering and comparison

Trend signals are normalized across years rather than treating raw catalog counts as direct popularity measurements.

The Trends ML service is implemented as an independent FastAPI service.

3. STUDIO — Generative AI

Studio is FASHNOVA's creative intelligence layer.

It is responsible for generating fashion-related creative outputs rather than directly acting as the recommendation engine.

Current Studio architecture:

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

Current capabilities include:

Structured fashion generation requests
Fashion context conditioning
Trend-context interface
Vision-context interface
Prompt construction
AI design generation
Image response handling
Generation validation
Error handling

The currently implemented generation workflow is:

Design Generation

The architecture is prepared for future:

Concept generation
Pattern generation
Style variations
Reference-based generation
Additional trend-aware generation workflows
4. STYLE ENGINE — Recommendation Intelligence

The Style Engine is the central recommendation intelligence layer of FASHNOVA.

It will combine:

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

The Style Engine is intended to provide:

Recommendation scoring
Recommendation ranking
Personalization
Context-aware recommendations
Visual signal integration
Trend signal integration
Studio-generated creative signals
User preference modeling
Feedback-driven improvement

Recommendation logic will remain on the backend/service layer rather than being implemented directly inside the frontend.

🏗️ System Architecture

FASHNOVA follows a modular full-stack architecture.

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
       └──────────────┘    │ Vision       :8001 │
                           │ Trends       :8002 │
                           │ Studio       :8003 │
                           │ Style Engine :8004 │
                           └────────────────────┘

The Node.js backend acts as the integration boundary between:

Frontend
Database
Authentication
User profile
Vision ML service
Trends ML service
Studio GenAI service
Future Style Engine
🔌 Service Architecture
Service	Technology	Development Port	Purpose
Frontend	React + Vite	5173	FASHNOVA web application
Backend	Node.js + Express	5000	Main application API
Vision	Python + FastAPI	8001	Computer Vision
Trends	Python + FastAPI	8002	Trend intelligence
Studio	Python + FastAPI	8003	Generative AI
Style Engine	Python / ML	8004	Recommendation intelligence
PostgreSQL	PostgreSQL	5432	Application database

The independent service architecture allows each AI/ML component to be developed, tested, maintained, and eventually deployed independently.

🛠️ Technology Stack
Frontend
React
Vite
JavaScript
React Router
CSS
ESLint
Backend
Node.js
Express 5
REST APIs
Axios
Zod validation
JWT authentication
bcryptjs
CORS
Multer
Database
PostgreSQL
Prisma ORM
Prisma PostgreSQL adapter
Machine Learning & AI
Python
FastAPI
Uvicorn
PyTorch
Torchvision
Hugging Face Transformers
Pillow
scikit-learn
Google GenAI SDK
Computer Vision

AutoCatalogAI CLIP Multitask Classifier V2

Based on:

CLIP ViT-B/32
Multi-task classification
Fashion attribute prediction
Hierarchical classification
Color feature branch
Trends ML

The Trends ML pipeline includes:

Dataset processing
Data cleaning
Feature engineering
Normalized yearly trend signals
Trend detection
Trend scoring
Trend lifecycle analysis
Forecasting
Forecast validation
Confidence estimation
Studio GenAI

Studio uses a hosted image-generation model through the Google GenAI API.

The architecture intentionally keeps large generative models outside the local machine so that the project can run without requiring a dedicated local NVIDIA GPU for the generative workflow.

📁 Project Structure
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
│   │   │   ├── profile/
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
│       │   ├── StyleEngine.jsx
│       │   ├── Profile.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       │
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
│   │
🚀 Implemented So Far
Project Foundation
 FASHNOVA project initialized
 Core architecture defined
 Vision / Trends / Studio / Style Engine architecture established
 Production-oriented folder structure established
 Git repository initialized
 GitHub repository connected
 Development checkpoints committed
Frontend
 React + Vite application
 React Router integration
 FASHNOVA navigation
 FASHNOVA logo integrated
 Home page
 Vision page
 Trends page
 Studio page
 Style Engine route
 Profile page
 Login page
 Registration page
 Authentication context
 Vision upload interface
 Vision analysis result interface
 Trends intelligence interface
 Studio generation workspace
 Profile preference interface
 Responsive styling for core pages
 AI/ML-first product presentation
Backend
 Node.js + Express backend
 Environment configuration
 Environment validation using Zod
 PostgreSQL integration
 Prisma integration
 Authentication APIs
 JWT authentication
 Password hashing
 Profile API
 User preference API
 Profile preference validation
 Global error handling
 Request validation middleware
 Vision routes
 Vision image upload endpoint
 Vision analysis endpoint
 Vision ML service communication
 Trends API
 Studio API
 Studio request validation
 Studio ML service communication
Vision ML
 Vision FastAPI service
 Vision application structure
 Model loading
 Model inference integration
 Fashion attribute prediction
 Prediction response structure
 Vision health endpoint
 Vision analysis endpoint
 Local service verification
Trends ML
 Fashion dataset ingestion
 Data cleaning
 Normalized yearly trend signals
 Feature engineering
 Trend detection
 Trend lifecycle classification
 Trend scoring
 ML forecasting
 Forecast validation
 Forecast confidence estimation
 Trends FastAPI service
 Trends local service verification
 Backend integration verification
 End-to-end Trends verification
Studio GenAI
 Studio Python service structure
 Studio request/response schemas
 Prompt builder
 Fashion context conditioning
 Trend context interface
 Vision context interface
 Gemini GenAI service integration
 Design generation workflow
 Studio FastAPI service
 Studio backend API
 Studio frontend workspace
 Studio backend → ML connection
 Generation validation and error handling
 Concept generation workflow
 Pattern generation workflow
 Style variation generation workflow
 Production image storage
👁️ Vision Pipeline
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

The Vision pipeline is designed as an independent ML service behind the Node.js backend.

The model produces structured predictions for:

Gender
Master Category
Sub Category
Article Type
Base Colour
Season
Usage
📈 Trends Pipeline
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

The Trends ML service can run independently from the Node.js backend and exposes an HTTP API for trend analysis.

The current development priority is to keep the stable application core isolated while ML service integration is finalized.

🎨 Studio Pipeline
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

Studio is designed as a genuine GenAI service rather than a frontend-only simulation.

👤 Profile & Personalization

FASHNOVA includes a user profile layer intended to provide the foundation for future personalization.

Current profile preferences include:

Preferred styles
Preferred colors
Preferred seasons
Preferred categories
Preferred fits
Favorite brands
Minimum budget
Maximum budget

The profile layer is designed to become an input to the future Style Engine.

USER
 ↓
PROFILE
 ↓
PREFERENCES
 ↓
STYLE ENGINE
 ↓
PERSONALIZED RECOMMENDATIONS
🔐 Security & Configuration

Sensitive configuration is intentionally excluded from Git.

Examples include:

Database credentials
JWT secrets
Gemini API keys
Local environment variables
Uploaded user images
Python virtual environments
Node modules
Model artifacts
Local development tooling

A .env.example file should be used as a configuration template.

Never commit API keys or .env files containing secrets.

⚙️ Environment Configuration

The backend uses environment variables for application and service configuration.

Example:

NODE_ENV=development

PORT=5000

FRONTEND_URL=http://localhost:5173

VISION_ML_URL=http://127.0.0.1:8001
TRENDS_ML_URL=http://127.0.0.1:8002
STUDIO_ML_URL=http://127.0.0.1:8003
STYLE_ENGINE_ML_URL=http://127.0.0.1:8004

DATABASE_URL=your_database_url

JWT_SECRET=your_jwt_secret

The actual .env file must remain local and must never be committed.

🧪 Testing Strategy

FASHNOVA is being developed with testing and validation as part of the architecture.

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

Future evaluation will include:

Classification accuracy
Precision
Recall
F1-score
Confidence analysis
Error analysis
Forecast validation
Model latency
CPU/GPU performance
Domain-shift evaluation
API reliability
End-to-end workflow validation
📌 Development Status
Overall Project

Phase: Core Application Stabilization & Deployment Preparation

Module	Status
Project Architecture	🟢 Established
Frontend Foundation	🟢 Implemented
Authentication	🟢 Implemented
Database Foundation	🟢 Implemented
Backend Foundation	🟢 Implemented
Profile & Preferences	🟢 Implemented
Vision	🟢 Implemented
Vision ML Service	🟢 Local implementation
Trends ML	🟢 Local implementation
Trends API	🟡 Integration verification
Trends UI	🟢 Implemented
Studio GenAI Architecture	🟢 Implemented
Studio API	🟢 Implemented
Studio UI	🟢 Implemented
Studio ML Service	🟢 Local implementation
Style Engine	🔵 Planned
Recommendation System	🔵 Planned
End-to-End Integration	🔵 Planned
Production Deployment	🔵 Planned
Status Legend
🟢 Implemented / established
🟡 In progress / verification required
🔵 Planned
🗺️ Development Roadmap
Phase 1 — Foundation
 Project architecture
 Technology stack
 Repository structure
 Frontend foundation
 Backend foundation
 Database foundation
 Authentication
 Profile and preferences
Phase 2 — Vision
 Vision UI
 Image upload
 Image storage
 Vision database entities
 Vision API
 Python Vision service
 Model architecture reconstruction
 Model checkpoint loading
 Model inference integration
 Prediction normalization
 Vision result handling
 Broader model evaluation
 Production hardening
Phase 3 — Trends
 Fashion dataset pipeline
 Data cleaning
 Feature engineering
 Trend detection
 Trend lifecycle classification
 Trend scoring
 Historical analysis
 Seasonal signal support
 ML forecasting
 Forecast validation
 Forecast confidence estimation
 Trends FastAPI service
 Trends UI
 Backend integration verification
 End-to-end verification
Phase 4 — Studio
 GenAI architecture
 Fashion generation schema
 Prompt construction
 Fashion context conditioning
 Trend-aware conditioning interface
 Vision-aware conditioning interface
 Design generation workflow
 Gemini image-generation integration
 Studio API
 Studio UI
 Concept generation workflow
 Pattern generation workflow
 Style variation generation workflow
 Production image storage
Phase 5 — Style Engine
 User preference modeling
 Vision signal integration
 Trend signal integration
 Studio signal integration
 Recommendation feature engineering
 Recommendation scoring
 Recommendation ranking
 Personalization
 Context-aware recommendations
 Feedback loop
 Recommendation API
Phase 6 — Integration
 Connect Vision → Style Engine
 Connect Trends → Style Engine
 Connect Studio → Style Engine
 Connect user profile → Style Engine
 Complete recommendation workflow
 End-to-end testing
Phase 7 — Evaluation & Deployment
 Backend testing
 ML evaluation
 Integration testing
 Security testing
 Performance testing
 Production configuration
 Object/image storage
 Production database
 Backend deployment
 Frontend deployment
 ML service deployment
 Monitoring
 Documentation
💻 Local Development
Prerequisites

Make sure the following are installed:

Node.js
npm
Python
PostgreSQL
Git
Backend

From the FASHNOVA root:

cd backend
npm install
npm run dev

Backend:

http://localhost:5000

Health endpoint:

/api/health
Frontend

From the FASHNOVA root:

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173
Vision ML Service

Run from the FASHNOVA project root:

python -m uvicorn ml.vision.app.main:app --host 127.0.0.1 --port 8001

Service:

http://127.0.0.1:8001

Health endpoint:

/health

Analysis endpoint:

/analyze
Trends ML Service

Run from the FASHNOVA project root:

python -m uvicorn ml.trends.app.main:app --host 127.0.0.1 --port 8002

Service:

http://127.0.0.1:8002

Health endpoint:

/health

Analysis endpoint:

/analyze
Studio ML Service

Run from the FASHNOVA project root:

python -m uvicorn ml.studio.app.main:app --host 127.0.0.1 --port 8003

Service:

http://127.0.0.1:8003

Health endpoint:

/health

Generation endpoint:

/generate

Studio image generation requires a configured GEMINI_API_KEY.

API credentials must never be committed to Git.

🗄️ Database

FASHNOVA uses:

PostgreSQL
Prisma ORM

The application database contains structured entities for areas such as:

Users
User preferences
Fashion items
Fashion images
Vision analysis
Authentication-related data

Database configuration is provided through:

DATABASE_URL=your_database_url

Database schema changes should be validated before production migrations are applied.

🌐 Repository

The source code is maintained on GitHub:

PDisha-01/FASHNOVA

The repository contains:

Frontend application
Node.js backend
PostgreSQL/Prisma database layer
Vision ML service
Trends ML service
Studio GenAI service
Documentation
Data and ML project structure
🚀 Deployment Strategy

FASHNOVA is being prepared for staged deployment.

The intended production architecture is:

                         INTERNET
                            │
                            ↓
                  ┌──────────────────┐
                  │ FASHNOVA WEB APP │
                  │ React + Vite     │
                  └────────┬─────────┘
                           │
                           ↓
                  ┌──────────────────┐
                  │   BACKEND API    │
                  │ Node + Express   │
                  └───────┬──────────┘
                          │
              ┌───────────┼───────────┐
              ↓           ↓           ↓
        PostgreSQL      Vision      Trends
                        ML Service   ML Service
                            │           │
                            └─────┬─────┘
                                  ↓
                               Studio
                               GenAI
                                  │
                                  ↓
                           Style Engine

Deployment will be performed in stages:

Production database
Backend API
Frontend application
Production environment configuration
ML service deployment
ML service integration
End-to-end testing
Monitoring and production hardening

The stable application core should be deployed and verified before additional ML changes are introduced.

This allows individual ML services to be developed or upgraded without unnecessarily destabilizing the frontend, backend, authentication, profile, and database foundation.

⚠️ Current Limitations

FASHNOVA is currently under active development.

At the current stage:

Vision is implemented as a local ML service.
Trends ML is implemented as a local ML service.
Trends backend integration still requires final verification.
Studio architecture and local service integration are implemented.
Studio requires a configured Gemini API key for actual image generation.
The Style Engine has not yet been implemented.
Production object/image storage has not yet been configured.
Production deployment has not yet been completed.
Broader ML evaluation remains future work.
Production hardening remains future work.
ML services are currently developed and tested locally.

These limitations are expected during the current development phase.

🎯 Project Goal

FASHNOVA is being developed beyond a basic CRUD application or isolated AI demo.

The long-term goal is to build a complete fashion intelligence pipeline:

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

The system is designed so that each intelligence layer contributes meaningful information to the final recommendation experience.

🧩 Engineering Principles

FASHNOVA is being developed with the following principles:

Modular Architecture

Each intelligence capability has its own module and service boundary.

Production-Oriented Structure

The project uses:

Environment configuration
Input validation
Error handling
Service separation
Database abstraction
API boundaries
Testing
Deployment considerations
AI/ML-First Product

AI and ML are core components of FASHNOVA rather than optional features added to a conventional fashion website.

Personalization

User preferences and fashion intelligence are designed to work together through the Style Engine.

Independent ML Services

Vision, Trends, Studio, and Style Engine are separated so that each intelligence system can be developed, tested, and eventually deployed independently.

Stable Core Application

The frontend, backend, authentication, profile, and database foundation should remain stable while individual ML services are developed and improved.

📄 License

License information will be added as the project approaches its release/deployment stage.

🚧 Development

FASHNOVA is currently under active development.

The architecture, database, backend, AI/ML services, and frontend are being developed incrementally with emphasis on:

Clean architecture
Modularity
Validation
Error handling
Model versioning
Testing
Security
Maintainability
Deployment readiness
Scalable AI/ML integration
FASHNOVA
Fashion Meets Intelligence

