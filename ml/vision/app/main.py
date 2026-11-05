import sys
from pathlib import Path
from typing import Optional

# Ensure vision and ml packages are in sys.path
CURRENT_FILE = Path(__file__).resolve()
ML_ROOT = CURRENT_FILE.parents[2]
VISION_ROOT = CURRENT_FILE.parents[1]

for path_entry in [str(ML_ROOT), str(VISION_ROOT)]:
    if path_entry not in sys.path:
        sys.path.insert(0, path_entry)

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from io import BytesIO

from vision.inference.predictor import create_predictor


app = FastAPI(
    title="FASHNOVA Vision ML Service",
    version="0.2.0",
)


predictor = create_predictor()


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "FASHNOVA Vision ML",
        "status": "healthy",
        "model": predictor.model_name,
    }


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    original_name: Optional[str] = Form(None),
    target_gender: Optional[str] = Form(None),
):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WebP images are supported.",
        )

    image_bytes = await file.read()

    try:
        image = Image.open(BytesIO(image_bytes))
        image.load()
    except (UnidentifiedImageError, OSError) as error:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        ) from error

    try:
        result = predictor.predict(
            image,
            original_name=original_name or file.filename,
            target_gender=target_gender,
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Vision inference failed: {error}",
        ) from error

    return {
        "success": True,
        "data": result,
    }
