const asyncHandler = require('../utils/asyncHandler');
const Hospital = require('../models/Hospital');
const { sortByDistance } = require('../utils/geo');

const listAll = asyncHandler(async (req, res) => {
  const data = await Hospital.find().sort({ name: 1 });
  res.json({ success: true, data });
});

const nearby = asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat ?? req.user?.latitude);
  const lon = Number(req.query.lon ?? req.user?.longitude);
  const hospitals = await Hospital.find({ status: { $ne: 'FULL' } }).lean();
  const sorted = sortByDistance(hospitals, lat, lon);
  res.json({ success: true, data: sorted.slice(0, 10) });
});

const createHospital = asyncHandler(async (req, res) => {
  const data = await Hospital.create(req.body);
  res.status(201).json({ success: true, data });
});

const updateHospital = asyncHandler(async (req, res) => {
  const data = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!data) return res.status(404).json({ success: false, message: 'Hospital not found' });
  res.json({ success: true, data });
});

const deleteHospital = asyncHandler(async (req, res) => {
  await Hospital.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Hospital deleted' });
});

module.exports = { listAll, nearby, createHospital, updateHospital, deleteHospital };
