const asyncHandler = require('../utils/asyncHandler');
const RescueResource = require('../models/RescueResource');
const { sortByDistance } = require('../utils/geo');

const listAll = asyncHandler(async (req, res) => {
  const data = await RescueResource.find().sort({ name: 1 });
  res.json({ success: true, data });
});

const nearby = asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat ?? req.user?.latitude);
  const lon = Number(req.query.lon ?? req.user?.longitude);
  const resources = await RescueResource.find().lean();
  const sorted = sortByDistance(resources, lat, lon);
  res.json({ success: true, data: sorted.slice(0, 15) });
});

const createResource = asyncHandler(async (req, res) => {
  const data = await RescueResource.create(req.body);
  res.status(201).json({ success: true, data });
});

const updateResource = asyncHandler(async (req, res) => {
  const data = await RescueResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!data) return res.status(404).json({ success: false, message: 'Resource not found' });
  res.json({ success: true, data });
});

const deleteResource = asyncHandler(async (req, res) => {
  await RescueResource.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Resource deleted' });
});

module.exports = { listAll, nearby, createResource, updateResource, deleteResource };
