"""Train RandomForest flood risk classifier and persist the model."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

from app.config import get_settings
from scripts.prepare_data import main as prepare_data


def main() -> None:
    settings = get_settings()
    data_path = Path(settings.data_path)

    if not data_path.exists():
        print(f"Training data not found at {data_path}; generating synthetic dataset...")
        prepare_data()

    df = pd.read_csv(data_path)
    if len(df) < 500:
        raise ValueError(f"Training dataset must have at least 500 rows, found {len(df)}")

    X = df[settings.feature_columns]
    y = df["riskLevel"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=settings.random_seed,
        stratify=y,
    )

    test_path = Path(settings.test_data_path)
    test_path.parent.mkdir(parents=True, exist_ok=True)
    test_df = X_test.copy()
    test_df["riskLevel"] = y_test.values
    test_df.to_csv(test_path, index=False)

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        random_state=settings.random_seed,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    model_path = Path(settings.model_path)
    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, model_path)

    train_accuracy = model.score(X_train, y_train)
    test_accuracy = model.score(X_test, y_test)
    print(f"Model saved to {model_path}")
    print(f"Train accuracy: {train_accuracy:.4f}")
    print(f"Hold-out test accuracy (preview): {test_accuracy:.4f}")
    print(f"Test set saved to {test_path} ({len(test_df)} rows)")


if __name__ == "__main__":
    main()
