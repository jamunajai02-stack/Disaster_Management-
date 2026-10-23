# ML Documentation

## Model

- **Algorithm:** RandomForestClassifier (scikit-learn)
- **Task:** Flood risk classification → LOW / MEDIUM / HIGH
- **Output:** `riskProbability`, `riskLevel`

## Features

`rainfall`, `temperature`, `humidity`, `windSpeed`, `pressure`, `historicalRisk`, `latitude`, `longitude`

## Thresholds (demo/project)

Configured in `ml-service/.env`:
- `RISK_THRESHOLD_LOW=35`
- `RISK_THRESHOLD_MEDIUM=65`

These label synthetic training data — not scientifically validated for real-world forecasting.

## Scripts

```powershell
cd ml-service
py -3 scripts/prepare_data.py
py -3 scripts/train.py
py -3 scripts/evaluate.py
```

## Metrics

Stored in `ml-service/models/metrics.json` from the held-out test set only.

## API

`POST http://localhost:8000/predict`

```json
{
  "rainfall": 120,
  "temperature": 28,
  "humidity": 85,
  "windSpeed": 15,
  "pressure": 1005,
  "historicalRisk": 0.7,
  "latitude": 14.68,
  "longitude": 77.60
}
```

## Disclaimer

Predictions are **risk estimates** for a college project demo. They are not guaranteed forecasts or official warnings.
