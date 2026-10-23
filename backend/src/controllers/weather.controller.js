const asyncHandler = require('../utils/asyncHandler');
const { getCurrentWeather } = require('../services/weatherService');

const getCurrent = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ success: false, message: 'lat and lon query params required' });
  }

  const weather = await getCurrentWeather(lat, lon);
  res.json({ success: true, data: weather });
});

module.exports = { getCurrent };
