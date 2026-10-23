const DisasterPrediction = require('../models/DisasterPrediction');
const SensorReading = require('../models/SensorReading');
const { predictFloodRisk } = require('./mlService');
const { processHighRiskAlert } = require('./alertProcessorService');
const { createNotification } = require('./notificationService');

function waterLevelToHistoricalRisk(waterLevel) {
  return Math.min(1, Math.max(0, Number(waterLevel) / 6));
}

async function processEnvironmentalReading({
  rainfall,
  waterLevel,
  humidity,
  temperature,
  latitude,
  longitude,
  locationName,
  scenario = 'NORMAL',
  source = 'SIMULATED',
  windSpeed = 12,
  pressure = 1008,
  notifyUserId = null,
}) {
  const historicalRisk = waterLevelToHistoricalRisk(waterLevel);

  const mlInput = {
    rainfall: Number(rainfall),
    temperature: Number(temperature),
    humidity: Number(humidity),
    windSpeed: Number(windSpeed),
    pressure: Number(pressure),
    historicalRisk,
    latitude: Number(latitude),
    longitude: Number(longitude),
  };

  const prediction = await predictFloodRisk(mlInput);
  let riskLevel = prediction.riskLevel;
  let riskProbability = prediction.riskProbability;

  if (scenario === 'HIGH_RISK' && riskLevel !== 'HIGH') {
    riskLevel = 'HIGH';
    riskProbability = Math.max(riskProbability, 0.85);
  }

  const doc = await DisasterPrediction.create({
    disasterType: 'FLOOD',
    latitude: mlInput.latitude,
    longitude: mlInput.longitude,
    locationName,
    ...mlInput,
    riskProbability,
    riskLevel,
    modelVersion: prediction.modelVersion || '1.0.0',
    source,
  });

  const reading = await SensorReading.create({
    rainfall: mlInput.rainfall,
    waterLevel: Number(waterLevel),
    humidity: mlInput.humidity,
    temperature: mlInput.temperature,
    latitude: mlInput.latitude,
    longitude: mlInput.longitude,
    locationName,
    scenario,
    source,
    predictionId: doc._id,
  });

  let alertResult = null;
  if (riskLevel === 'HIGH') {
    alertResult = await processHighRiskAlert({
      prediction: doc,
      affectedLocation: { latitude, longitude, locationName },
      riskLevel: 'HIGH',
      source,
    });

    if (notifyUserId) {
      await createNotification({
        userId: notifyUserId,
        title: `[${source}] High flood risk estimate`,
        message: `Simulated sensor data indicates HIGH flood risk near ${locationName}. Not an official warning.`,
        type: 'RISK',
      });
    }
  }

  return {
    reading,
    prediction: doc,
    alertResult,
    mlInput,
    disclaimer: 'Simulated sensor data for college prototype demonstration only.',
  };
}

module.exports = { processEnvironmentalReading, waterLevelToHistoricalRisk };
