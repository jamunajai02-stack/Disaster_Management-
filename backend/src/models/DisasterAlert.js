const mongoose = require('mongoose');

const disasterAlertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    disasterType: { type: String, required: true },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
    affectedArea: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radiusKm: { type: Number, default: 25 },
    instructions: { type: String, default: '' },
    active: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiresAt: Date,
    source: { type: String, enum: ['LIVE', 'DEMO', 'SIMULATED'], default: 'LIVE' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DisasterAlert', disasterAlertSchema);
