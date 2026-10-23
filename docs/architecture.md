# Architecture — Local Review Prototype

## Current prototype (what runs today)

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | React + Vite + Tailwind | User + admin dashboards, map, charts |
| Backend | Node.js + Express | JWT auth, REST APIs, local alert processor |
| Database | MongoDB Atlas | Required |
| ML | Python FastAPI + Random Forest | Flood risk estimates |
| Images | `backend/uploads/` | Local storage (default) |
| Notifications | MongoDB + in-app UI | No Firebase required |
| Sensors | `sensor-simulator/` | Software simulator (not real IoT) |
| Weather | OpenWeatherMap OR demo fallback | API key optional |

## Data flows

### Flood risk from weather
```
User → POST /api/predictions → Weather (live or DEMO) → FastAPI ML → MongoDB
```

### Simulated sensor pipeline (review demo)
```
Sensor Simulator → POST /api/sensors/readings
        → Risk Pipeline Service → FastAPI ML
        → If HIGH → Local Alert Processor → Alert + Notifications
```

### Emergency report with image
```
User → POST /api/emergencies (multipart) → backend/uploads/ → MongoDB
Admin views image via /uploads/... served by Express
```

## Local alert processor

Implemented in `backend/src/services/alertProcessorService.js`.

No AWS Lambda required. The Lambda handler in `lambda/` is preserved as an **optional future cloud deployment** reference.

## Optional cloud extensions (NOT required)

- AWS S3 — set `USE_AWS_S3=true` + credentials
- AWS Lambda — deploy `lambda/alert-processor/handler.js`
- Firebase push — configure `FIREBASE_*` env vars
- Physical IoT — replace simulator with real sensor APIs

## Disclaimer

College prototype. Simulated data is clearly labelled DEMO/SIMULATED. Not an official warning system.
