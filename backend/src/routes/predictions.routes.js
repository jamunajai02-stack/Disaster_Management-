const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  predictForLocation,
  listPredictions,
  getLatestForUser,
} = require('../controllers/predictions.controller');

const router = express.Router();
router.post('/', authenticate, predictForLocation);
router.get('/', authenticate, authorize('ADMIN'), listPredictions);
router.get('/latest', authenticate, getLatestForUser);

module.exports = router;
