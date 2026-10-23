require('dotenv').config();
const dns = require('dns');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('../config');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const User = require('../models/User');
const Shelter = require('../models/Shelter');
const Hospital = require('../models/Hospital');
const RescueResource = require('../models/RescueResource');
const EmergencyReport = require('../models/EmergencyReport');
const DisasterAlert = require('../models/DisasterAlert');
const DisasterPrediction = require('../models/DisasterPrediction');
const Notification = require('../models/Notification');

const { connectDatabase } = require('../config/database');

async function runSeed({ disconnect = true } = {}) {
  if (mongoose.connection.readyState === 0) {
    await connectDatabase();
    console.log('Connected for seeding...');
  }

  await Promise.all([
    User.deleteMany({}),
    Shelter.deleteMany({}),
    Hospital.deleteMany({}),
    RescueResource.deleteMany({}),
    EmergencyReport.deleteMany({}),
    DisasterAlert.deleteMany({}),
    DisasterPrediction.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const password = await bcrypt.hash('Demo@123', 10);

  const admin = await User.create({
    name: 'Demo Admin',
    email: 'admin@demo.sdrp',
    password,
    phone: '+91-9000000001',
    role: 'ADMIN',
    latitude: 14.6819,
    longitude: 77.6006,
    locationName: 'Anantapur, Andhra Pradesh',
  });

  const users = await User.insertMany([
    {
      name: 'Demo User One',
      email: 'user1@demo.sdrp',
      password,
      role: 'USER',
      latitude: 14.675,
      longitude: 77.595,
      locationName: 'Anantapur Central',
    },
    {
      name: 'Demo User Two',
      email: 'user2@demo.sdrp',
      password,
      role: 'USER',
      latitude: 14.69,
      longitude: 77.61,
      locationName: 'Anantapur East',
    },
  ]);

  const shelters = await Shelter.insertMany([
    {
      name: 'Municipal Community Shelter',
      latitude: 14.679,
      longitude: 77.598,
      address: 'MG Road, Anantapur',
      capacity: 500,
      currentOccupancy: 120,
      contact: '+91-8554-123456',
      status: 'OPEN',
    },
    {
      name: 'School Emergency Shelter',
      latitude: 14.672,
      longitude: 77.605,
      address: 'Near RTC Bus Stand, Anantapur',
      capacity: 300,
      currentOccupancy: 80,
      contact: '+91-8554-654321',
      status: 'OPEN',
    },
  ]);

  const hospitals = await Hospital.insertMany([
    {
      name: 'District General Hospital',
      latitude: 14.683,
      longitude: 77.602,
      address: 'Hospital Road, Anantapur',
      emergencyCapacity: 80,
      contact: '+91-8554-222222',
      status: 'AVAILABLE',
    },
    {
      name: 'City Trauma Center',
      latitude: 14.677,
      longitude: 77.592,
      address: 'Ring Road, Anantapur',
      emergencyCapacity: 40,
      contact: '+91-8554-333333',
      status: 'LIMITED',
    },
  ]);

  const resources = await RescueResource.insertMany([
    {
      name: 'Rescue Team Alpha',
      type: 'RESCUE_TEAM',
      latitude: 14.68,
      longitude: 77.6,
      contact: '+91-9000000101',
      capacity: 12,
      status: 'AVAILABLE',
    },
    {
      name: 'Ambulance Unit 7',
      type: 'AMBULANCE',
      latitude: 14.676,
      longitude: 77.604,
      contact: '+91-9000000102',
      capacity: 2,
      status: 'AVAILABLE',
    },
    {
      name: 'Medical Team Bravo',
      type: 'MEDICAL_TEAM',
      latitude: 14.685,
      longitude: 77.608,
      contact: '+91-9000000103',
      capacity: 8,
      status: 'AVAILABLE',
    },
    {
      name: 'Food Supply Convoy',
      type: 'FOOD_SUPPLY',
      latitude: 14.67,
      longitude: 77.59,
      contact: '+91-9000000104',
      capacity: 200,
      status: 'AVAILABLE',
    },
  ]);

  await EmergencyReport.insertMany([
    {
      userId: users[0]._id,
      disasterType: 'FLOOD',
      latitude: 14.674,
      longitude: 77.597,
      locationName: 'Low-lying ward, Anantapur',
      description: 'Water entering homes after heavy rainfall.',
      peopleAffected: 6,
      urgency: 'HIGH',
      status: 'PENDING',
    },
    {
      userId: users[1]._id,
      disasterType: 'FLOOD',
      latitude: 14.688,
      longitude: 77.612,
      locationName: 'Canal-side colony',
      description: 'Road blocked, families need evacuation support.',
      peopleAffected: 12,
      urgency: 'CRITICAL',
      status: 'ACKNOWLEDGED',
    },
  ]);

  await DisasterAlert.create({
    title: '[DEMO] Moderate flood watch',
    message: 'Demo alert: monitor rainfall and avoid flood-prone routes.',
    disasterType: 'FLOOD',
    riskLevel: 'MEDIUM',
    affectedArea: 'Anantapur district',
    latitude: 14.6819,
    longitude: 77.6006,
    radiusKm: 30,
    instructions: 'Keep emergency kit ready and follow local guidance.',
    active: true,
    createdBy: admin._id,
    source: 'DEMO',
  });

  await DisasterPrediction.create({
    disasterType: 'FLOOD',
    latitude: 14.6819,
    longitude: 77.6006,
    locationName: 'Anantapur, Andhra Pradesh',
    rainfall: 45,
    temperature: 29,
    humidity: 78,
    windSpeed: 12,
    pressure: 1008,
    historicalRisk: 0.4,
    riskProbability: 0.42,
    riskLevel: 'MEDIUM',
    modelVersion: '1.0.0',
    source: 'DEMO',
  });

  await Notification.create({
    userId: users[0]._id,
    title: 'Welcome to SDRP Demo',
    message: 'This is a demonstration notification. Not an official warning.',
    type: 'SYSTEM',
    read: false,
  });

  console.log('\n=== DEMO CREDENTIALS (development only) ===');
  console.log('Admin: admin@demo.sdrp / Demo@123');
  console.log('User:  user1@demo.sdrp / Demo@123');
  console.log('User:  user2@demo.sdrp / Demo@123');
  console.log('===========================================\n');

  if (disconnect) {
    await mongoose.disconnect();
    console.log('Seed complete.');
  } else {
    console.log('Seed complete (connection kept open).');
  }
}

async function seedCli() {
  await runSeed({ disconnect: true });
}

if (require.main === module) {
  seedCli().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { runSeed };
