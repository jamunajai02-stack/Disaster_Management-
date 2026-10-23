const asyncHandler = require('../utils/asyncHandler');
const DisasterPrediction = require('../models/DisasterPrediction');
const { getCurrentWeather } = require('../services/weatherService');
const { predictFloodRisk } = require('../services/mlService');
const { processHighRiskAlert } = require('../services/alertProcessorService');
const { createNotification } = require('../services/notificationService');

const HISTORICAL_RISK = 45; // 0–100 scale, matches ML training data

const predictForLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude, locationName, historicalRisk = HISTORICAL_RISK, source = 'LIVE' } =
    req.body;

  if (latitude == null || longitude == null || !locationName) {
    return res.status(400).json({ success: false, message: 'latitude, longitude, locationName required' });
  }

  const weather = await getCurrentWeather(latitude, longitude);
  const mlInput = {
    rainfall: weather.rainfall ?? 0,
    temperature: weather.temperature ?? 28,
    humidity: weather.humidity ?? 70,
    windSpeed: weather.windSpeed ?? 10,
    pressure: weather.pressure ?? 1013,
    historicalRisk: Number(historicalRisk),
    latitude: Number(latitude),
    longitude: Number(longitude),
  };

  const prediction = await predictFloodRisk(mlInput);
  const doc = await DisasterPrediction.create({
    disasterType: 'FLOOD',
    latitude: Number(latitude),
    longitude: Number(longitude),
    locationName,
    ...mlInput,
    riskProbability: prediction.riskProbability,
    riskLevel: prediction.riskLevel,
    modelVersion: prediction.modelVersion || '1.0.0',
    source,
  });

  if (prediction.riskLevel === 'HIGH') {
    await processHighRiskAlert({
      prediction: doc,
      affectedLocation: { latitude, longitude, locationName },
      riskLevel: 'HIGH',
      source,
    });
    if (req.user) {
      await createNotification({
        userId: req.user._id,
        title: `[${source}] High flood risk estimate`,
        message: `Estimated HIGH flood risk near ${locationName}. This is not an official warning.`,
        type: 'RISK',
      });
    }
  }

  res.status(201).json({ success: true, data: doc, weather, disclaimer: 'Risk estimate for demo purposes only.' });
});

const listPredictions = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const data = await DisasterPrediction.find().sort({ createdAt: -1 }).limit(limit);
  res.json({ success: true, data });
});

const getLatestForUser = asyncHandler(async (req, res) => {
  const data = await DisasterPrediction.findOne({
    latitude: { $gte: req.user.latitude - 0.5, $lte: req.user.latitude + 0.5 },
    longitude: { $gte: req.user.longitude - 0.5, $lte: req.user.longitude + 0.5 },
  }).sort({ createdAt: -1 });

  res.json({ success: true, data });
});

module.exports = { predictForLocation, listPredictions, getLatestForUser };
