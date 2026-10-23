const asyncHandler = require('../utils/asyncHandler');
const EmergencyReport = require('../models/EmergencyReport');
const RescueResource = require('../models/RescueResource');
const User = require('../models/User');
const { saveEmergencyImage } = require('../services/uploadService');
const { createNotification, notifyUsers } = require('../services/notificationService');
const { sortByDistance } = require('../utils/geo');

const createReport = asyncHandler(async (req, res) => {
  const { disasterType, latitude, longitude, locationName, description, peopleAffected, urgency } =
    req.body;

  if (!disasterType || latitude == null || longitude == null || !locationName || !description) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = await saveEmergencyImage(req.file);
  }

  const report = await EmergencyReport.create({
    userId: req.user._id,
    disasterType,
    latitude: Number(latitude),
    longitude: Number(longitude),
    locationName,
    description,
    peopleAffected: Number(peopleAffected) || 1,
    urgency: urgency || 'MEDIUM',
    imageUrl,
  });

  const admins = await User.find({ role: 'ADMIN' }).select('_id');
  if (admins.length) {
    await notifyUsers(admins.map((a) => a._id), {
      title: 'New emergency report',
      message: `${req.user.name} reported ${disasterType} at ${locationName}`,
      type: 'EMERGENCY',
    });
  }

  res.status(201).json({ success: true, data: report });
});

const myReports = asyncHandler(async (req, res) => {
  const data = await EmergencyReport.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data });
});

const listReports = asyncHandler(async (req, res) => {
  const data = await EmergencyReport.find()
    .populate('userId', 'name email phone')
    .populate('assignedResourceId')
    .sort({ createdAt: -1 });
  res.json({ success: true, data });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const report = await EmergencyReport.findById(req.params.id);
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

  report.status = status || report.status;
  await report.save();

  if (status === 'ACKNOWLEDGED') {
    await createNotification({
      userId: report.userId,
      title: 'Emergency acknowledged',
      message: `Your ${report.disasterType} report at ${report.locationName} was acknowledged.`,
      type: 'EMERGENCY',
    });
  }

  res.json({ success: true, data: report });
});

const assignResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.body;
  const report = await EmergencyReport.findById(req.params.id);
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

  const resource = await RescueResource.findById(resourceId);
  if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

  report.assignedResourceId = resource._id;
  report.status = 'RESOURCE_ASSIGNED';
  resource.status = 'BUSY';
  await report.save();
  await resource.save();

  await createNotification({
    userId: report.userId,
    title: 'Resource assigned',
    message: `${resource.name} (${resource.type}) assigned to your emergency.`,
    type: 'EMERGENCY',
  });

  res.json({ success: true, data: report });
});

const nearbyResources = asyncHandler(async (req, res) => {
  const report = await EmergencyReport.findById(req.params.id);
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

  const resources = await RescueResource.find({ status: 'AVAILABLE' }).lean();
  const sorted = sortByDistance(resources, report.latitude, report.longitude);
  res.json({ success: true, data: sorted.slice(0, 20) });
});

module.exports = {
  createReport,
  myReports,
  listReports,
  updateStatus,
  assignResource,
  nearbyResources,
};
