from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from io import BytesIO

from vision.inference.predictor import create_predictor


app = FastAPI(
    title="FASHNOVA Vision ML Service",
    version="0.1.0",
)


predictor = create_predictor()


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "FASHNOVA Vision ML",
        "status": "healthy",
    }


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
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
        result = predictor.predict(image)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Vision inference failed.",
        ) from error

    return {
        "success": True,
        "data": result,
    }