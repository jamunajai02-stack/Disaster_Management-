const axios = require('axios');
const config = require('../config');

async function predictFloodRisk(features) {
  const { data } = await axios.post(`${config.mlServiceUrl}/predict`, features, {
    timeout: 10000,
  });
  return data;
}

module.exports = { predictFloodRisk };
