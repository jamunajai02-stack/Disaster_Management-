# AWS Lambda — Optional Future Extension

The **default alert processor runs locally** inside the Express backend:
`backend/src/services/alertProcessorService.js`

This folder preserves a Lambda-compatible handler for future cloud deployment only.

## Local test (requires MongoDB + backend .env)

```powershell
cd lambda/alert-processor
node local-runner.js
```

## Not required for college review

No AWS account or credentials needed. Use Admin Dashboard → **Simulate HIGH sensor reading** or `sensor-simulator/simulator.js` instead.
