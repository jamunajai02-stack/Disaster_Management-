const User = require('../models/User');
const DisasterAlert = require('../models/DisasterAlert');
const DisasterPrediction = require('../models/DisasterPrediction');
const { haversineDistanceKm } = require('../utils/geo');
const { notifyUsers } = require('./notificationService');

async function processHighRiskAlert({ prediction, affectedLocation, riskLevel, source = 'LIVE' }) {
  if (riskLevel !== 'HIGH') {
    return { success: false, message: 'Only HIGH risk triggers automated alerts' };
  }

  const { latitude, longitude, locationName } = affectedLocation;
  const radiusKm = 50;

  const users = await User.find({ role: 'USER' });
  const affectedUsers = users.filter(
    (user) => haversineDistanceKm(latitude, longitude, user.latitude, user.longitude) <= radiusKm
  );

  const alert = await DisasterAlert.create({
    title: `[${source}] High flood risk — ${locationName}`,
    message: `Risk estimate indicates HIGH flood risk near ${locationName}. This is a project demo estimate, not an official warning.`,
    disasterType: prediction?.disasterType || 'FLOOD',
    riskLevel: 'HIGH',
    affectedArea: locationName,
    latitude,
    longitude,
    radiusKm,
    instructions: 'Move to higher ground, monitor alerts, and contact local authorities if needed.',
    active: true,
    source,
  });

  if (prediction?._id) {
    await DisasterPrediction.findByIdAndUpdate(prediction._id, { source });
  }

  const notifications = affectedUsers.length
    ? await notifyUsers(
        affectedUsers.map((u) => u._id),
        {
          title: `[${source}] High flood risk near you`,
          message: `Estimated HIGH flood risk near ${locationName}. Check alerts for guidance.`,
          type: 'RISK',
        }
      )
    : [];

  return {
    success: true,
    alert,
    affectedUserCount: affectedUsers.length,
    notificationCount: notifications.length,
    source,
  };
}

module.exports = { processHighRiskAlert };
