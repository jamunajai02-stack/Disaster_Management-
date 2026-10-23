const mongoose = require('mongoose');

const disasterPredictionSchema = new mongoose.Schema(
  {
    disasterType: { type: String, default: 'FLOOD' },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    locationName: { type: String, required: true },
    rainfall: Number,
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    pressure: Number,
    historicalRisk: Number,
    riskProbability: { type: Number, required: true },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
    modelVersion: { type: String, default: '1.0.0' },
    source: { type: String, enum: ['LIVE', 'DEMO', 'SIMULATED'], default: 'LIVE' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DisasterPrediction', disasterPredictionSchema);
