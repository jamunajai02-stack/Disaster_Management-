const axios = require('axios');
const mongoose = require('mongoose');
const config = require('../config');

async function getHealth(_req, res, next) {
  try {
    let ml = { status: 'unreachable' };
    try {
      const { data } = await axios.get(`${config.mlServiceUrl}/health`, { timeout: 2000 });
      ml = data;
    } catch {
      ml.message = 'Start ML service on port 8000';
    }

    res.status(200).json({
      success: true,
      service: 'sdrp-backend',
      status: 'ok',
      timestamp: new Date().toISOString(),
      dependencies: {
        database: {
          status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        },
        ml,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getHealth };
