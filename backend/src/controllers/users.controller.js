const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.toSafeObject() });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'latitude', 'longitude', 'locationName', 'notificationToken'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ success: true, data: req.user.toSafeObject() });
});

module.exports = { getProfile, updateProfile };
