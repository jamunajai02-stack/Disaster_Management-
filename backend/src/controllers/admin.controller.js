const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const EmergencyReport = require('../models/EmergencyReport');
const DisasterPrediction = require('../models/DisasterPrediction');
const RescueResource = require('../models/RescueResource');
const { processEnvironmentalReading } = require('../services/riskPipelineService');

const listUsers = asyncHandler(async (req, res) => {
  const data = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data });
});

const analytics = asyncHandler(async (req, res) => {
  const [byDisasterType, byUrgency, byRiskLevel, byStatus, resourceAvailability, predictionHistory] =
    await Promise.all([
      EmergencyReport.aggregate([{ $group: { _id: '$disasterType', count: { $sum: 1 } } }]),
      EmergencyReport.aggregate([{ $group: { _id: '$urgency', count: { $sum: 1 } } }]),
      DisasterPrediction.aggregate([{ $group: { _id: '$riskLevel', count: { $sum: 1 } } }]),
      EmergencyReport.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      RescueResource.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      DisasterPrediction.find()
        .sort({ createdAt: -1 })
        .limit(30)
        .select('riskLevel riskProbability createdAt locationName source'),
    ]);

  res.json({
    success: true,
    data: {
      byDisasterType,
      byUrgency,
      byRiskLevel,
      byStatus,
      resourceAvailability,
      predictionHistory,
    },
  });
});

const triggerDemoHighRisk = asyncHandler(async (req, res) => {
  const { latitude = 14.68, longitude = 77.6, locationName = 'Anantapur, Andhra Pradesh' } =
    req.body;

  const result = await processEnvironmentalReading({
    rainfall: 180,
    waterLevel: 5.2,
    humidity: 95,
    temperature: 27,
    latitude: Number(latitude),
    longitude: Number(longitude),
    locationName,
    scenario: 'HIGH_RISK',
    source: 'DEMO',
    windSpeed: 22,
    pressure: 998,
  });

  res.json({
    success: true,
    message: 'DEMO high flood risk event triggered via simulated sensor pipeline',
    data: result,
    disclaimer: 'Simulated event for college project demonstration only.',
  });
});

module.exports = { listUsers, analytics, triggerDemoHighRisk };
