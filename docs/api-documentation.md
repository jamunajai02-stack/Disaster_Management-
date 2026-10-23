# API Documentation

Base URL: `http://localhost:5000`

All protected routes require header: `Authorization: Bearer <token>`

## Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register user/admin |
| POST | `/api/auth/login` | Public | Login |

## Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/me` | User | Profile |
| PUT | `/api/users/me` | User | Update profile/location |

## Weather

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/weather/current?lat=&lon=` | Public | Current weather (LIVE or DEMO) |

## Predictions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/predictions` | User | Run flood risk estimate |
| GET | `/api/predictions/latest` | User | Latest nearby prediction |
| GET | `/api/predictions` | Admin | List predictions |

## Emergencies

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/emergencies` | User | Create report (multipart image optional) |
| GET | `/api/emergencies/mine` | User | My reports |
| GET | `/api/emergencies` | Admin | All reports |
| PATCH | `/api/emergencies/:id/status` | Admin | Update status |
| POST | `/api/emergencies/:id/assign` | Admin | Assign resource |
| GET | `/api/emergencies/:id/nearby-resources` | Admin | Nearby available resources |

## Alerts, Shelters, Hospitals, Resources

CRUD + `/nearby` endpoints for shelters, hospitals, resources.

## Notifications

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/notifications` | User |
| PATCH | `/api/notifications/:id/read` | User |
| PATCH | `/api/notifications/read-all` | User |

## Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/users` | List users |
| GET | `/api/admin/analytics` | Chart data |
| POST | `/api/admin/demo/high-risk` | Trigger DEMO high-risk via sensor pipeline |

## Sensors (simulated IoT)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/sensors/readings` | Public in DEMO_MODE | Process simulated sensor data through ML |
| GET | `/api/sensors/readings` | Admin | List recent simulated readings |

## Health

| Method | Path |
|--------|------|
| GET | `/health` |

## Response format

Success: `{ "success": true, "data": ... }`  
Error: `{ "success": false, "message": "..." }`
