# FASHNOVA Vision ML

Computer Vision service for FASHNOVA.

## Responsibilities

- Fashion image analysis
- Garment classification
- Fashion attribute extraction
- Color and pattern analysis
- Style-related visual features
- Vision outputs for the FASHNOVA Style Engine

## Model

The Vision service uses a pretrained fashion attribute model.

Model integration is isolated inside:

`services/model_service.py`

This keeps the FastAPI layer independent from the underlying ML model.

## Development

Activate the virtual environment:

```powershell
ml\vision\.venv\Scripts\activate