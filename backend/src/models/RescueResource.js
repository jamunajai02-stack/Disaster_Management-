const mongoose = require('mongoose');

const rescueResourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['AMBULANCE', 'RESCUE_TEAM', 'FOOD_SUPPLY', 'MEDICAL_TEAM', 'OTHER'],
      required: true,
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    contact: { type: String, required: true },
    capacity: { type: Number, default: 1, min: 0 },
    status: { type: String, enum: ['AVAILABLE', 'BUSY', 'OFFLINE'], default: 'AVAILABLE' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RescueResource', rescueResourceSchema);
