const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification');

const listMine = asyncHandler(async (req, res) => {
  const data = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data });
});

const markRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true }
  );
  res.json({ success: true, message: 'Marked as read' });
});

const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id }, { read: true });
  res.json({ success: true, message: 'All notifications marked read' });
});

module.exports = { listMine, markRead, markAllRead };
