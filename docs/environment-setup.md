# Environment Setup

## Required

| Variable | File | Description |
|----------|------|-------------|
| `MONGODB_URI` | `backend/.env` | MongoDB Atlas connection string |
| `JWT_SECRET` | `backend/.env` | Any long random string for JWT signing |

## Recommended defaults

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEMO_MODE` | `true` | Allows sensor simulator without admin auth |
| `WEATHER_DEMO_MODE` | `true` if no API key | Demo weather when OpenWeatherMap unavailable |
| `USE_AWS_S3` | `false` | Local uploads in `backend/uploads/` |

## Optional (app works without these)

| Variable | Purpose |
|----------|---------|
| `WEATHER_API_KEY` | Live OpenWeatherMap data |
| `USE_AWS_S3` + `AWS_*` | Cloud image storage instead of local |
| `FIREBASE_*` | Push notifications (in-app works without) |

## Frontend

```env
VITE_API_URL=http://localhost:5000
```

## ML service

```env
PORT=8000
MODEL_PATH=./models/flood_risk_model.joblib
```

## Sensor simulator

```env
API_URL=http://localhost:5000
```

Missing optional variables never crash the application.
