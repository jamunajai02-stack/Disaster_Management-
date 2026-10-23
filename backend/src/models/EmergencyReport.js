const mongoose = require('mongoose');

const emergencyReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    disasterType: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    locationName: { type: String, required: true },
    description: { type: String, required: true },
    peopleAffected: { type: Number, default: 1, min: 0 },
    urgency: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
    imageUrl: String,
    status: {
      type: String,
      enum: ['PENDING', 'ACKNOWLEDGED', 'RESOURCE_ASSIGNED', 'IN_PROGRESS', 'RESOLVED'],
      default: 'PENDING',
    },
    assignedResourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueResource' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmergencyReport', emergencyReportSchema);
