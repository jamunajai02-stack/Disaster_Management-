# AWS Deployment — Future Extension Only

> **Not required for college review.** The prototype runs entirely locally.

This document describes how the project *could* be deployed to AWS in a future phase.

## Current prototype uses instead

| Cloud service | Local replacement |
|---------------|-------------------|
| AWS S3 | `backend/uploads/` |
| AWS Lambda | `alertProcessorService.js` in Express |
| Firebase FCM | In-app notifications in MongoDB |

## Future deployment map

| Component | AWS service |
|-----------|-------------|
| Frontend | S3 + CloudFront |
| Backend | EC2 + ALB + Auto Scaling |
| ML | EC2 |
| Database | MongoDB Atlas (unchanged) |
| Images | S3 (set `USE_AWS_S3=true`) |
| Alerts | Lambda (`lambda/alert-processor/`) |
| Monitoring | CloudWatch |

## Enabling S3 (optional)

```env
USE_AWS_S3=true
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=your-bucket
```

## Lambda reference

`lambda/alert-processor/handler.js` mirrors the local alert processor logic for cloud deployment. Test locally:

```powershell
cd lambda/alert-processor
node local-runner.js
```

Do not describe this as currently deployed unless you have actually deployed it.
