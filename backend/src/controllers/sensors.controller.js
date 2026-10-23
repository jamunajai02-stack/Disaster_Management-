const asyncHandler = require('../utils/asyncHandler');
const config = require('../config');
const SensorReading = require('../models/SensorReading');
const { processEnvironmentalReading } = require('../services/riskPipelineService');

const submitReading = asyncHandler(async (req, res) => {
  const {
    rainfall,
    waterLevel,
    humidity,
    temperature,
    latitude = 14.68,
    longitude = 77.6,
    locationName = 'Anantapur, Andhra Pradesh',
    scenario = 'NORMAL',
    windSpeed,
    pressure,
  } = req.body;

  if ([rainfall, waterLevel, humidity, temperature].some((v) => v == null)) {
    return res.status(400).json({
      success: false,
      message: 'rainfall, waterLevel, humidity, and temperature are required',
    });
  }

  const isHighScenario =
    scenario === 'HIGH_RISK' || Number(rainfall) >= 120 || Number(waterLevel) >= 4;

  const result = await processEnvironmentalReading({
    rainfall,
    waterLevel,
    humidity,
    temperature,
    latitude,
    longitude,
    locationName,
    scenario: isHighScenario ? 'HIGH_RISK' : 'NORMAL',
    source: 'SIMULATED',
    windSpeed,
    pressure,
    notifyUserId: req.user?._id,
  });

  res.status(201).json({
    success: true,
    data: result,
    message: config.demoMode
      ? 'Simulated sensor reading processed through ML risk pipeline'
      : 'Sensor reading processed',
  });
});

const listReadings = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const data = await SensorReading.find().sort({ createdAt: -1 }).limit(limit);
  res.json({ success: true, data });
});

module.exports = { submitReading, listReadings };
