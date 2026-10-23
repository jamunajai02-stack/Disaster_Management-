import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parents[1]

FEATURE_COLUMNS = [
    "rainfall",
    "temperature",
    "humidity",
    "windSpeed",
    "pressure",
    "historicalRisk",
    "latitude",
    "longitude",
]

RISK_LEVELS = ["LOW", "MEDIUM", "HIGH"]


class Settings:
    port: int
    model_path: str
    data_path: str
    test_data_path: str
    metrics_path: str
    training_samples: int
    random_seed: int
    risk_threshold_low: float
    risk_threshold_medium: float
    feature_columns: list[str]

    def __init__(self) -> None:
        self.port = int(os.getenv("PORT", "8000"))
        self.model_path = os.getenv(
            "MODEL_PATH", str(BASE_DIR / "models" / "flood_risk_model.joblib")
        )
        self.data_path = os.getenv(
            "DATA_PATH", str(BASE_DIR / "data" / "flood_training.csv")
        )
        self.test_data_path = os.getenv(
            "TEST_DATA_PATH", str(BASE_DIR / "data" / "flood_test.csv")
        )
        self.metrics_path = os.getenv(
            "METRICS_PATH", str(BASE_DIR / "models" / "metrics.json")
        )
        self.training_samples = int(os.getenv("TRAINING_SAMPLES", "600"))
        self.random_seed = int(os.getenv("RANDOM_SEED", "42"))
        self.risk_threshold_low = float(os.getenv("RISK_THRESHOLD_LOW", "35"))
        self.risk_threshold_medium = float(os.getenv("RISK_THRESHOLD_MEDIUM", "65"))
        self.feature_columns = FEATURE_COLUMNS


@lru_cache
def get_settings() -> Settings:
    return Settings()
