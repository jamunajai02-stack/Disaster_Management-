from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from app.config import get_settings
from app.schemas import PredictRequest


class FloodRiskPredictor:
    def __init__(self) -> None:
        self._settings = get_settings()
        self._model = None
        self._model_path = Path(self._settings.model_path)

    @property
    def model_loaded(self) -> bool:
        return self._model is not None

    def model_exists(self) -> bool:
        return self._model_path.exists()

    def load(self) -> bool:
        if not self._model_path.exists():
            self._model = None
            return False

        self._model = joblib.load(self._model_path)
        return True

    def ensure_loaded(self) -> None:
        if self._model is None:
            if not self.load():
                raise FileNotFoundError(
                    f"Flood risk model not found at {self._model_path}. "
                    "Run scripts/train.py to generate the model."
                )

    def predict(self, request: PredictRequest) -> tuple[str, float]:
        self.ensure_loaded()

        features = pd.DataFrame(
            [
                {
                    "rainfall": request.rainfall,
                    "temperature": request.temperature,
                    "humidity": request.humidity,
                    "windSpeed": request.windSpeed,
                    "pressure": request.pressure,
                    "historicalRisk": request.historicalRisk,
                    "latitude": request.latitude,
                    "longitude": request.longitude,
                }
            ]
        )

        probabilities = self._model.predict_proba(features)[0]
        classes = list(self._model.classes_)
        best_index = int(np.argmax(probabilities))
        risk_level = classes[best_index]
        risk_probability = float(probabilities[best_index])

        return risk_level, round(risk_probability, 4)


_predictor: FloodRiskPredictor | None = None


def get_predictor() -> FloodRiskPredictor:
    global _predictor
    if _predictor is None:
        _predictor = FloodRiskPredictor()
        _predictor.load()
    return _predictor
