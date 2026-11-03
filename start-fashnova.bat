@echo off
title FASHNOVA - AI-Powered Fashion Intelligence Platform
echo ==============================================================
echo           FASHNOVA - STARTING ALL SERVICES
echo ==============================================================

:: 1. Ensure PostgreSQL is running
echo [1/4] Checking PostgreSQL Database Service...
net start postgresql-x64-16 >nul 2>&1
net start postgresql-x64-15 >nul 2>&1
net start postgresql >nul 2>&1

:: 2. Start ML Services (Using virtualenv with all ML dependencies)
set "PY_CMD=python"
if exist "ml\.venv\Scripts\python.exe" set "PY_CMD=ml\.venv\Scripts\python.exe"
echo [2/4] Starting FASHNOVA ML Services (Vision :8001, Trends :8002, Studio :8003, Style Engine :8004)...
start "FASHNOVA ML Services" cmd /k "%PY_CMD% ml/run_all_services.py"

:: 3. Start Backend API
echo [3/4] Starting FASHNOVA Backend API on port 5000...
start "FASHNOVA Backend" cmd /k "cd backend && npm run dev"

:: 4. Start Frontend
echo [4/4] Starting FASHNOVA Web App on port 5173...
start "FASHNOVA Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 >nul
start http://localhost:5173

echo ==============================================================
echo  ALL SERVICES STARTED SUCCESSFULLY!
echo  Web App: http://localhost:5173
echo  Backend: http://localhost:5000
echo ==============================================================
