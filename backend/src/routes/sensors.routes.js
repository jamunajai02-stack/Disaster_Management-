const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const config = require('../config');
const { submitReading, listReadings } = require('../controllers/sensors.controller');

const router = express.Router();

function allowSensorSubmission(req, res, next) {
  if (config.demoMode || config.nodeEnv !== 'production') {
    return next();
  }
  return authenticate(req, res, () => authorize('ADMIN')(req, res, next));
}

router.post('/readings', allowSensorSubmission, submitReading);
router.get('/readings', authenticate, authorize('ADMIN'), listReadings);

module.exports = router;
