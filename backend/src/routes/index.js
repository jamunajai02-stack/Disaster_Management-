const express = require('express');
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const weatherRoutes = require('./weather.routes');
const predictionsRoutes = require('./predictions.routes');
const emergenciesRoutes = require('./emergencies.routes');
const alertsRoutes = require('./alerts.routes');
const sheltersRoutes = require('./shelters.routes');
const hospitalsRoutes = require('./hospitals.routes');
const resourcesRoutes = require('./resources.routes');
const notificationsRoutes = require('./notifications.routes');
const adminRoutes = require('./admin.routes');
const sensorsRoutes = require('./sensors.routes');
const healthRoutes = require('./health.routes');

const router = express.Router();

router.use('/', healthRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/users', usersRoutes);
router.use('/api/weather', weatherRoutes);
router.use('/api/predictions', predictionsRoutes);
router.use('/api/emergencies', emergenciesRoutes);
router.use('/api/alerts', alertsRoutes);
router.use('/api/shelters', sheltersRoutes);
router.use('/api/hospitals', hospitalsRoutes);
router.use('/api/resources', resourcesRoutes);
router.use('/api/notifications', notificationsRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/sensors', sensorsRoutes);

module.exports = router;
