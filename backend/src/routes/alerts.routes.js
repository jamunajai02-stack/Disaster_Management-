const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { listActive, createAlert, updateAlert } = require('../controllers/alerts.controller');

const router = express.Router();
router.get('/', authenticate, listActive);
router.post('/', authenticate, authorize('ADMIN'), createAlert);
router.patch('/:id', authenticate, authorize('ADMIN'), updateAlert);

module.exports = router;
