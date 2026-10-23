const express = require('express');
const { getCurrent } = require('../controllers/weather.controller');

const router = express.Router();
router.get('/current', getCurrent);

module.exports = router;
