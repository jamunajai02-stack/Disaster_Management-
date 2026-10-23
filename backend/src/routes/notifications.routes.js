const express = require('express');
const { authenticate } = require('../middleware/auth');
const { listMine, markRead, markAllRead } = require('../controllers/notifications.controller');

const router = express.Router();
router.get('/', authenticate, listMine);
router.patch('/read-all', authenticate, markAllRead);
router.patch('/:id/read', authenticate, markRead);

module.exports = router;
