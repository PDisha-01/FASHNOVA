import torch  # type: ignore[reportMissingImports]  # noqa: F401
import torch.nn as nn  # type: ignore[reportMissingImports]
from transformers import CLIPModel  # type: ignore[reportMissingImports]


class AttributeHead(nn.Module):
    def __init__(self, hidden_dim: int, num_classes: int, dropout: float):
        super().__init__()

        self.net = nn.Sequential(
            nn.LayerNorm(hidden_dim),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, num_classes),
        )

    def forward(self, x):
        return self.net(x)


class ColorBranch(nn.Sequential):
    def __init__(
        self,
        color_feature_dim: int,
        num_classes: int,
        dropout: float,
    ):
        super().__init__(
            nn.LayerNorm(color_feature_dim),
            nn.Linear(color_feature_dim, 64),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(64, num_classes),
        )
class CLIPMultiTaskClassifierV2(nn.Module):
    def __init__(
        self,
        task_num_classes: dict,
        hidden_dim: int = 512,
        dropout: float = 0.2,
        color_feature_dim: int = 37,
    ):
        super().__init__()

        self.clip = CLIPModel.from_pretrained(
            "openai/clip-vit-base-patch32"
        )

        # Every task, including baseColour, has its own attribute head.
        self.heads = nn.ModuleDict({
            task: AttributeHead(
                hidden_dim=hidden_dim,
                num_classes=num_classes,
                dropout=dropout,
            )
            for task, num_classes in task_num_classes.items()
        })

        # Additional dedicated color branch.
        self.color_branch = ColorBranch(
            color_feature_dim=color_feature_dim,
            num_classes=task_num_classes["baseColour"],
            dropout=dropout,
        )

        # Hierarchical residual connections.
        self.master_to_sub = nn.Linear(
            task_num_classes["masterCategory"],
            task_num_classes["subCategory"],
            bias=False,
        )

        self.sub_to_article = nn.Linear(
            task_num_classes["subCategory"],
            task_num_classes["articleType"],
            bias=False,
        )

        self.article_to_season = nn.Linear(
            task_num_classes["articleType"],
            task_num_classes["season"],
            bias=False,
        )

        self.article_to_usage = nn.Linear(
            task_num_classes["articleType"],
            task_num_classes["usage"],
            bias=False,
        )

    def forward(self, pixel_values, color_features):
        clip_output = self.clip.get_image_features(pixel_values=pixel_values)

        if hasattr(clip_output, "pooler_output"):
            image_features = clip_output.pooler_output
        else:
            image_features = clip_output

        # Normalize the CLIP representation.
        image_features = image_features / (
            image_features.norm(dim=-1, keepdim=True) + 1e-8
        )

        outputs = {}

        # Base predictions for every task.
        for task, head in self.heads.items():
            outputs[task] = head(image_features)

        # Hierarchical residual connections.
        outputs["subCategory"] = (
            outputs["subCategory"]
            + self.master_to_sub(outputs["masterCategory"])
        )

        outputs["articleType"] = (
            outputs["articleType"]
            + self.sub_to_article(outputs["subCategory"])
        )

        outputs["season"] = (
            outputs["season"]
            + self.article_to_season(outputs["articleType"])
        )

        outputs["usage"] = (
            outputs["usage"]
            + self.article_to_usage(outputs["articleType"])
        )

        # Dedicated color branch.
        outputs["baseColour"] = (
            outputs["baseColour"]
            + self.color_branch(color_features)
        )

        return outputs