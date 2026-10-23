const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema(
  {
    rainfall: { type: Number, required: true },
    waterLevel: { type: Number, required: true },
    humidity: { type: Number, required: true },
    temperature: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    locationName: { type: String, required: true },
    scenario: { type: String, enum: ['NORMAL', 'HIGH_RISK'], default: 'NORMAL' },
    source: { type: String, enum: ['SIMULATED', 'DEMO'], default: 'SIMULATED' },
    predictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'DisasterPrediction' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
