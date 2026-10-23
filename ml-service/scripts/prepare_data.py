"""Generate synthetic flood risk training data with configurable demo thresholds."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import numpy as np
import pandas as pd

from app.config import RISK_LEVELS, get_settings


def compute_risk_score(
    rainfall: np.ndarray,
    temperature: np.ndarray,
    humidity: np.ndarray,
    wind_speed: np.ndarray,
    pressure: np.ndarray,
    historical_risk: np.ndarray,
    latitude: np.ndarray,
    longitude: np.ndarray,
) -> np.ndarray:
    """Derive a 0-100 flood risk score from weather and location features."""
    rainfall_component = np.clip(rainfall / 120.0, 0, 1) * 35
    humidity_component = np.clip(humidity / 100.0, 0, 1) * 15
    historical_component = np.clip(historical_risk / 100.0, 0, 1) * 25
    pressure_component = np.clip((1020 - pressure) / 40.0, 0, 1) * 10
    wind_component = np.clip(wind_speed / 60.0, 0, 1) * 5
    temp_component = np.clip((temperature - 20) / 20.0, 0, 1) * 5
    geo_component = np.clip(
        (np.abs(latitude - 20) + np.abs(longitude - 78)) / 40.0, 0, 1
    ) * 5

    score = (
        rainfall_component
        + humidity_component
        + historical_component
        + pressure_component
        + wind_component
        + temp_component
        + geo_component
    )
    noise = np.random.normal(0, 4, size=len(rainfall))
    return np.clip(score + noise, 0, 100)


def label_risk_levels(scores: np.ndarray, low_max: float, medium_max: float) -> list[str]:
    labels: list[str] = []
    for score in scores:
        if score <= low_max:
            labels.append("LOW")
        elif score <= medium_max:
            labels.append("MEDIUM")
        else:
            labels.append("HIGH")
    return labels


def generate_dataset(n_samples: int, random_seed: int) -> pd.DataFrame:
    rng = np.random.default_rng(random_seed)

    rainfall = rng.uniform(0, 150, n_samples)
    temperature = rng.uniform(10, 40, n_samples)
    humidity = rng.uniform(30, 100, n_samples)
    wind_speed = rng.uniform(0, 50, n_samples)
    pressure = rng.uniform(980, 1030, n_samples)
    historical_risk = rng.uniform(0, 100, n_samples)
    latitude = rng.uniform(8, 35, n_samples)
    longitude = rng.uniform(68, 97, n_samples)

    scores = compute_risk_score(
        rainfall,
        temperature,
        humidity,
        wind_speed,
        pressure,
        historical_risk,
        latitude,
        longitude,
    )

    settings = get_settings()
    risk_levels = label_risk_levels(
        scores,
        settings.risk_threshold_low,
        settings.risk_threshold_medium,
    )

    return pd.DataFrame(
        {
            "rainfall": np.round(rainfall, 2),
            "temperature": np.round(temperature, 2),
            "humidity": np.round(humidity, 2),
            "windSpeed": np.round(wind_speed, 2),
            "pressure": np.round(pressure, 2),
            "historicalRisk": np.round(historical_risk, 2),
            "latitude": np.round(latitude, 4),
            "longitude": np.round(longitude, 4),
            "riskLevel": risk_levels,
        }
    )


def main() -> None:
    settings = get_settings()
    np.random.seed(settings.random_seed)

    df = generate_dataset(settings.training_samples, settings.random_seed)
    output_path = Path(settings.data_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)

    counts = df["riskLevel"].value_counts().reindex(RISK_LEVELS, fill_value=0)
    print(f"Saved {len(df)} rows to {output_path}")
    print("Risk level distribution:")
    for level in RISK_LEVELS:
        print(f"  {level}: {counts[level]}")


if __name__ == "__main__":
    main()
