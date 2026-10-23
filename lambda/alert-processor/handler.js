const mongoose = require('mongoose');
const User = require('../models/User');
const DisasterAlert = require('../models/DisasterAlert');
const Notification = require('../models/Notification');
const { haversineDistanceKm } = require('../utils/geo');

let dbReady = false;

async function ensureDb() {
  if (dbReady) return;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI required');
  await mongoose.connect(process.env.MONGODB_URI);
  dbReady = true;
}

exports.handler = async (event) => {
  try {
    await ensureDb();

    const payload = typeof event === 'string' ? JSON.parse(event) : event;
    const {
      disasterType = 'FLOOD',
      riskLevel,
      latitude,
      longitude,
      locationName,
      source = 'DEMO',
    } = payload;

    if (riskLevel !== 'HIGH') {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'No alert created for non-HIGH risk' }),
      };
    }

    const users = await User.find({ role: 'USER' });
    const affected = users.filter(
      (u) => haversineDistanceKm(latitude, longitude, u.latitude, u.longitude) <= 50
    );

    const alert = await DisasterAlert.create({
      title: `[${source}] High ${disasterType.toLowerCase()} risk — ${locationName}`,
      message: `Automated HIGH risk estimate near ${locationName}. Demo/project use only.`,
      disasterType,
      riskLevel: 'HIGH',
      affectedArea: locationName,
      latitude,
      longitude,
      radiusKm: 50,
      instructions: 'Move to safer ground and follow local authorities.',
      active: true,
      source,
    });

    if (affected.length) {
      await Notification.insertMany(
        affected.map((user) => ({
          userId: user._id,
          title: `[${source}] High risk near you`,
          message: `Estimated HIGH ${disasterType.toLowerCase()} risk near ${locationName}.`,
          type: 'RISK',
        }))
      );
    }

    console.log(
      JSON.stringify({
        event: 'HIGH_RISK_ALERT',
        source,
        locationName,
        affectedUsers: affected.length,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        alertId: alert._id,
        affectedUserCount: affected.length,
        source,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
