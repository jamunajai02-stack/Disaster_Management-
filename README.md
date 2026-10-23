# Smart Disaster Response Platform

**College prototype** — flood risk estimates, emergency reporting, and resource coordination.

Runs **100% locally/free** for review. No AWS, Firebase, or physical IoT hardware required.

## Required

- Node.js 18+
- Python 3.10+
- MongoDB Atlas
- Modern browser

## Optional

- OpenWeatherMap API key (demo weather fallback works without it)
- AWS S3 (`USE_AWS_S3=true` only if you configure cloud storage)
- Firebase (in-app notifications work without it)

## Quick start (review — works without Atlas)

If MongoDB Atlas login fails, use **embedded mode** (in-memory DB on your PC):

```powershell
cd backend
npm install
npm run dev:embedded
```

Wait for `Embedded DB empty — auto-seeding demo data...` then open http://localhost:5173

Login: `admin@demo.sdrp` / `Demo@123`

Also start ML + frontend in other terminals (see below).

### Fix Atlas (optional)

If `npm run test:mongo` shows **bad auth** → Atlas → Database Access → reset password → update `MONGODB_URI` in `.env`

See [docs/mongodb-troubleshooting.md](docs/mongodb-troubleshooting.md)

## Quick start (with Atlas)

```powershell
# One-time build
cd D:\Cloud
.\build-all.ps1

# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — ML
cd ml-service && .\venv\Scripts\activate && uvicorn main:app --reload --port 8000

# Terminal 3 — Frontend
cd frontend && npm run dev
```

Open http://localhost:5173

### Demo login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.sdrp | Demo@123 |
| User | user1@demo.sdrp | Demo@123 |

## Review demo flow (5 min)

1. Login as **user1@demo.sdrp** → Dashboard (weather, risk, alerts)
2. **Map** → shelters, hospitals, resources
3. **Emergency Report** → submit with optional image (stored in `backend/uploads/`)
4. Login as **admin@demo.sdrp**
5. **Admin → Reports** → acknowledge / assign resource
6. **Simulate HIGH sensor reading** (Admin Dashboard button) OR:
   ```powershell
   cd sensor-simulator && node simulator.js high
   ```
7. Login as user → **Notifications** + **Alerts** show HIGH risk event
8. **Analytics** → charts from MongoDB data

## Architecture (local prototype)

```
React Frontend → Express Backend → MongoDB Atlas
                      ├→ Local Alert Processor → In-App Notifications
                      └→ FastAPI ML (Random Forest)

Sensor Simulator → POST /api/sensors/readings → ML → Alert → Notification
```

## Documentation

- [Architecture](docs/architecture.md)
- [Demo script](docs/demo-instructions.md)
- [Environment setup](docs/environment-setup.md)
- [API docs](docs/api-documentation.md)
- [ML docs](docs/ml-documentation.md)
- [Sensor simulator](sensor-simulator/README.md)
- [Future AWS deployment](docs/aws-deployment.md) *(not required for review)*

## Disclaimer

Simulated sensor data and ML outputs are **risk estimates for demonstration only**. Not an official emergency warning system.
