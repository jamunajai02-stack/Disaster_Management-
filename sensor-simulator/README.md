# Sensor Data Simulator

Software-only simulator for college review demos. **Not real IoT hardware.**

## Scenarios

| Command | Rainfall | Water level | Risk |
|---------|----------|-------------|------|
| `node simulator.js normal` | 20 mm | 1.2 m | Normal estimate |
| `node simulator.js high` | 180 mm | 5.2 m | High-risk demo |

## Requirements

- Backend running on http://localhost:5000
- ML service running on http://localhost:8000
- `DEMO_MODE=true` in backend (default)

## Usage

```powershell
cd sensor-simulator
node simulator.js high
```

Optional watch mode (sends every 30 seconds):

```powershell
node simulator.js high --watch
```

Custom API URL:

```powershell
$env:API_URL="http://localhost:5000"
node simulator.js high
```

## Pipeline

```
Simulated readings → POST /api/sensors/readings → ML prediction → Alert (if HIGH) → Notifications
```

All data is labelled **SIMULATED** in the database.
