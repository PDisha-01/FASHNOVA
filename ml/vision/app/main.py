from fastapi import FastAPI

app = FastAPI(title="FASHNOVA Vision Service")


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "FASHNOVA Vision ML",
        "status": "healthy",
    }


@app.post("/analyze")
def analyze(data: dict):
    return {
        "success": True,
        "message": "Vision analysis received.",
        "fashionImageId": data.get("fashionImageId"),
        "status": "PENDING",
    }