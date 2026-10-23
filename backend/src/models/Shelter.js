const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true, min: 0 },
    currentOccupancy: { type: Number, default: 0, min: 0 },
    contact: { type: String, required: true },
    status: { type: String, enum: ['OPEN', 'FULL', 'CLOSED'], default: 'OPEN' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shelter', shelterSchema);
