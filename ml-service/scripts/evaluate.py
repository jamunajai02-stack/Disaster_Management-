"""Evaluate the trained model on the held-out test set."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import joblib
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    precision_recall_fscore_support,
)

from app.config import RISK_LEVELS, get_settings


def main() -> None:
    settings = get_settings()
    model_path = Path(settings.model_path)
    test_path = Path(settings.test_data_path)

    if not model_path.exists():
        raise FileNotFoundError(
            f"Model not found at {model_path}. Run scripts/train.py first."
        )
    if not test_path.exists():
        raise FileNotFoundError(
            f"Test set not found at {test_path}. Run scripts/train.py first."
        )

    model = joblib.load(model_path)
    test_df = pd.read_csv(test_path)

    X_test = test_df[settings.feature_columns]
    y_test = test_df["riskLevel"]
    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_test,
        y_pred,
        average="weighted",
        zero_division=0,
    )
    cm = confusion_matrix(y_test, y_pred, labels=RISK_LEVELS)

    per_class_precision, per_class_recall, per_class_f1, support = (
        precision_recall_fscore_support(
            y_test,
            y_pred,
            labels=RISK_LEVELS,
            zero_division=0,
        )
    )

    metrics = {
        "accuracy": round(float(accuracy), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1": round(float(f1), 4),
        "confusionMatrix": {
            "labels": RISK_LEVELS,
            "matrix": cm.tolist(),
        },
        "perClass": {
            level: {
                "precision": round(float(per_class_precision[i]), 4),
                "recall": round(float(per_class_recall[i]), 4),
                "f1": round(float(per_class_f1[i]), 4),
                "support": int(support[i]),
            }
            for i, level in enumerate(RISK_LEVELS)
        },
        "testSamples": int(len(y_test)),
    }

    metrics_path = Path(settings.metrics_path)
    metrics_path.parent.mkdir(parents=True, exist_ok=True)
    with open(metrics_path, "w", encoding="utf-8") as handle:
        json.dump(metrics, handle, indent=2)

    print(json.dumps(metrics, indent=2))
    print(f"Metrics saved to {metrics_path}")


if __name__ == "__main__":
    main()
