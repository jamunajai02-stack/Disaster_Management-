const asyncHandler = require('../utils/asyncHandler');
const DisasterAlert = require('../models/DisasterAlert');
const { notifyUsers } = require('../services/notificationService');
const User = require('../models/User');

const listActive = asyncHandler(async (req, res) => {
  const data = await DisasterAlert.find({ active: true }).sort({ createdAt: -1 });
  res.json({ success: true, data });
});

const createAlert = asyncHandler(async (req, res) => {
  const payload = req.body;
  const alert = await DisasterAlert.create({ ...payload, createdBy: req.user._id });

  const users = await User.find({ role: 'USER' });
  if (users.length) {
    await notifyUsers(users.map((u) => u._id), {
      title: payload.title,
      message: payload.message,
      type: 'ALERT',
    });
  }

  res.status(201).json({ success: true, data: alert });
});

const updateAlert = asyncHandler(async (req, res) => {
  const alert = await DisasterAlert.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
  res.json({ success: true, data: alert });
});

module.exports = { listActive, createAlert, updateAlert };
