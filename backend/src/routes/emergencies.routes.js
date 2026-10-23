const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createReport,
  myReports,
  listReports,
  updateStatus,
  assignResource,
  nearbyResources,
} = require('../controllers/emergencies.controller');

const router = express.Router();
router.post('/', authenticate, upload.single('image'), createReport);
router.get('/mine', authenticate, myReports);
router.get('/', authenticate, authorize('ADMIN'), listReports);
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateStatus);
router.post('/:id/assign', authenticate, authorize('ADMIN'), assignResource);
router.get('/:id/nearby-resources', authenticate, authorize('ADMIN'), nearbyResources);

module.exports = router;
