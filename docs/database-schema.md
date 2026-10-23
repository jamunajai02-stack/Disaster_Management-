# Database Schema

## User
`name`, `email`, `password`, `phone`, `role` (USER|ADMIN), `latitude`, `longitude`, `locationName`, `notificationToken`, timestamps

## DisasterPrediction
`disasterType`, location fields, weather features, `historicalRisk`, `riskProbability`, `riskLevel` (LOW|MEDIUM|HIGH), `modelVersion`, `source` (LIVE|DEMO|SIMULATED)

## EmergencyReport
`userId`, `disasterType`, location, `description`, `peopleAffected`, `urgency`, `imageUrl`, `status`, `assignedResourceId`, timestamps

Status flow: PENDING → ACKNOWLEDGED → RESOURCE_ASSIGNED → IN_PROGRESS → RESOLVED

## Shelter
`name`, location, `address`, `capacity`, `currentOccupancy`, `contact`, `status` (OPEN|FULL|CLOSED)

## Hospital
`name`, location, `address`, `emergencyCapacity`, `contact`, `status` (AVAILABLE|LIMITED|FULL)

## RescueResource
`name`, `type` (AMBULANCE|RESCUE_TEAM|FOOD_SUPPLY|MEDICAL_TEAM|OTHER), location, `contact`, `capacity`, `status` (AVAILABLE|BUSY|OFFLINE)

## DisasterAlert
`title`, `message`, `disasterType`, `riskLevel`, `affectedArea`, location, `radiusKm`, `instructions`, `active`, `createdBy`, `expiresAt`, `source`

## SensorReading
`rainfall`, `waterLevel`, `humidity`, `temperature`, location fields, `scenario` (NORMAL|HIGH_RISK), `source` (SIMULATED|DEMO), `predictionId`, timestamps

## Notification
`userId`, `title`, `message`, `type` (RISK|ALERT|EMERGENCY|SYSTEM), `read`, timestamps
