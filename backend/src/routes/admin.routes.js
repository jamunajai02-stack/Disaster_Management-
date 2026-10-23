const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { listUsers, analytics, triggerDemoHighRisk } = require('../controllers/admin.controller');

const router = express.Router();
router.get('/users', authenticate, authorize('ADMIN'), listUsers);
router.get('/analytics', authenticate, authorize('ADMIN'), analytics);
router.post('/demo/high-risk', authenticate, authorize('ADMIN'), triggerDemoHighRisk);

module.exports = router;
