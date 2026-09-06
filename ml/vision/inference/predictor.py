import json
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from transformers import CLIPImageProcessor

from vision.models.clip_multitask import CLIPMultiTaskClassifierV2
from vision.preprocessing.color_features import extract_color_features


MODEL_REPO = "mohsin416/autocatalogai-clip-multitask-v2"
CLIP_MODEL = "openai/clip-vit-base-patch32"

CHECKPOINT_PATH = Path(
    r"C:\Users\HP\.cache\huggingface\hub\models--mohsin416--autocatalogai-clip-multitask-v2"
    r"\snapshots\ea21b722a0ad769dd41f8594fdc8b5ce9cad8b49\model.pt"
)

LABEL_MAP_PATH = Path(
    r"C:\Users\HP\.cache\huggingface\hub\models--mohsin416--autocatalogai-clip-multitask-v2"
    r"\snapshots\ea21b722a0ad769dd41f8594fdc8b5ce9cad8b49\label_maps.json"
)

DEVICE = torch.device("cpu")


class FashionVisionPredictor:
    def __init__(self):
        self.device = DEVICE

        if not CHECKPOINT_PATH.exists():
            raise FileNotFoundError(
                f"Checkpoint not found: {CHECKPOINT_PATH}"
            )

        if not LABEL_MAP_PATH.exists():
            raise FileNotFoundError(
                f"Label maps not found: {LABEL_MAP_PATH}"
            )

        with LABEL_MAP_PATH.open("r", encoding="utf-8") as file:
            self.label_maps = json.load(file)

        checkpoint = torch.load(
            CHECKPOINT_PATH,
            map_location=self.device,
            weights_only=False,
        )

        task_num_classes = checkpoint["task_num_classes"]

        self.model = CLIPMultiTaskClassifierV2(
            task_num_classes=task_num_classes,
            hidden_dim=checkpoint["hidden_dim"],
            dropout=checkpoint["dropout"],
            color_feature_dim=checkpoint["color_feature_dim"],
        )

        self.model.load_state_dict(
            checkpoint["model_state_dict"],
            strict=True,
        )

        self.model.to(self.device)
        self.model.eval()

        self.processor = CLIPImageProcessor.from_pretrained(
            CLIP_MODEL
        )

        self.model_name = checkpoint.get(
            "model_name",
            MODEL_REPO,
        )

        self.model_version = checkpoint.get(
            "architecture_version",
            "unknown",
        )

    def _decode_label(self, task: str, index: int) -> str:
        task_map = self.label_maps[task]

        id2label = task_map["id2label"]

        return id2label[str(index)]

    def _predict_task(self, logits: torch.Tensor, task: str) -> dict:
        probabilities = torch.softmax(logits, dim=-1)

        confidence, index = torch.max(probabilities, dim=-1)

        predicted_index = int(index.item())
        predicted_confidence = float(confidence.item())

        return {
            "label": self._decode_label(
                task,
                predicted_index,
            ),
            "index": predicted_index,
            "confidence": predicted_confidence,
        }

    @torch.inference_mode()
    def predict(self, image: Image.Image) -> dict:
        image = image.convert("RGB")

        processed = self.processor(
            images=image,
            return_tensors="pt",
        )

        pixel_values = processed["pixel_values"].to(
            self.device
        )

        color_features_np = extract_color_features(image)

        color_features = torch.from_numpy(
            color_features_np
        ).unsqueeze(0).to(self.device)

        outputs = self.model(
            pixel_values=pixel_values,
            color_features=color_features,
        )

        tasks = [
            "gender",
            "masterCategory",
            "subCategory",
            "articleType",
            "baseColour",
            "season",
            "usage",
        ]

        predictions = {
            task: self._predict_task(
                outputs[task],
                task,
            )
            for task in tasks
        }

        return {
            "model": {
                "name": self.model_name,
                "version": self.model_version,
                "device": str(self.device),
            },
            "predictions": predictions,
        }

    def predict_file(self, image_path: str | Path) -> dict:
        image_path = Path(image_path)

        if not image_path.exists():
            raise FileNotFoundError(
                f"Image not found: {image_path}"
            )

        with Image.open(image_path) as image:
            return self.predict(image)


def create_predictor() -> FashionVisionPredictor:
    return FashionVisionPredictor()