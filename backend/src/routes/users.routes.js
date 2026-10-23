const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/users.controller');

const router = express.Router();
router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);

module.exports = router;
