const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    emergencyCapacity: { type: Number, required: true, min: 0 },
    contact: { type: String, required: true },
    status: { type: String, enum: ['AVAILABLE', 'LIMITED', 'FULL'], default: 'AVAILABLE' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
