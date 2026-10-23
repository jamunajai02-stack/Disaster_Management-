# Demo Instructions — Tomorrow's Review

## Before the review (10 min)

```powershell
cd D:\Cloud
.\build-all.ps1
```

Start 3 terminals (see README). Confirm:
- http://localhost:5000/health → `"status":"ok"`
- http://localhost:8000/health → `"modelLoaded":true`
- http://localhost:5173 loads

## Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.sdrp | Demo@123 |
| User | user1@demo.sdrp | Demo@123 |

## 5-minute demo script

### Part 1 — User experience (2 min)
1. Login as **user1@demo.sdrp**
2. **Dashboard** — point out weather, risk estimate, alerts, nearby resources
3. **Map** — toggle shelters / hospitals / resources
4. **Disaster Risk** — run flood risk estimate (shows LIVE or DEMO label)
5. **Emergency Report** — submit flood report + optional photo

### Part 2 — Admin coordination (2 min)
6. Logout → Login as **admin@demo.sdrp**
7. **Reports** — acknowledge report, assign rescue resource
8. **Shelters / Hospitals / Resources** — show CRUD management

### Part 3 — HIGH-RISK demo (1 min) ⭐
9. Admin Dashboard → click **Simulate HIGH sensor reading**
   - OR run: `cd sensor-simulator && node simulator.js high`
10. Explain pipeline:
    ```
    Simulated Sensor → Backend → ML → HIGH Risk → Alert → Notification
    ```
11. Logout → Login as **user1** → **Notifications** + **Alerts**
12. **Analytics** — show charts from real database

## What to say

- "This is a **software-only college prototype**, not an official warning system."
- "Sensor data is **simulated** — no physical IoT hardware."
- "ML outputs are **risk estimates**, not guaranteed forecasts."
- "Weather uses OpenWeatherMap when available, otherwise clearly labelled DEMO data."
- "Images stored locally in `backend/uploads/` — no AWS required."

## If something breaks

| Issue | Fix |
|-------|-----|
| Backend won't start | Check MongoDB Atlas IP whitelist |
| Port 8000 in use | `Stop-Process` old python or use port 8001 |
| No demo users | `cd backend && npm run seed` |
| ML unreachable | Start uvicorn in ml-service |
