"""
FASHNOVA Unified ML Services Runner
Starts all 4 FASHNOVA ML microservices concurrently:
  - Vision ML       : http://127.0.0.1:8001
  - Trends ML       : http://127.0.0.1:8002
  - Studio ML       : http://127.0.0.1:8003
  - Style Engine ML : http://127.0.0.1:8004
"""

import sys
import multiprocessing
import uvicorn
from pathlib import Path

# Add project root and ml packages to sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "ml"))
sys.path.insert(0, str(PROJECT_ROOT / "ml" / "vision"))


def run_vision():
    print("[FASHNOVA] Starting Vision ML service on http://127.0.0.1:8001 ...")
    uvicorn.run("ml.vision.app.main:app", host="127.0.0.1", port=8001, log_level="info")


def run_trends():
    print("[FASHNOVA] Starting Trends ML service on http://127.0.0.1:8002 ...")
    uvicorn.run("ml.trends.app.main:app", host="127.0.0.1", port=8002, log_level="info")


def run_studio():
    print("[FASHNOVA] Starting Studio ML service on http://127.0.0.1:8003 ...")
    uvicorn.run("ml.studio.app.main:app", host="127.0.0.1", port=8003, log_level="info")


def run_style_engine():
    print("[FASHNOVA] Starting Style Engine ML service on http://127.0.0.1:8004 ...")
    uvicorn.run("ml.style_engine.app.main:app", host="127.0.0.1", port=8004, log_level="info")


if __name__ == "__main__":
    multiprocessing.freeze_support()
    print("==================================================")
    print("   FASHNOVA AI/ML MULTI-SERVICE ENGINE LAUNCHER   ")
    print("==================================================")

    processes = [
        multiprocessing.Process(target=run_vision, name="Fashnova-Vision"),
        multiprocessing.Process(target=run_trends, name="Fashnova-Trends"),
        multiprocessing.Process(target=run_studio, name="Fashnova-Studio"),
        multiprocessing.Process(target=run_style_engine, name="Fashnova-StyleEngine"),
    ]

    for p in processes:
        p.daemon = True
        p.start()

    print("[FASHNOVA] All ML microservices launched successfully!")
    print("Press Ctrl+C to shut down all ML microservices.\n")

    try:
        for p in processes:
            p.join()
    except KeyboardInterrupt:
        print("\n[FASHNOVA] Stopping all ML services...")
        for p in processes:
            p.terminate()
        print("[FASHNOVA] All services stopped.")
