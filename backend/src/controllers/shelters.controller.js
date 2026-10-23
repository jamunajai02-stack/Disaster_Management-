const asyncHandler = require('../utils/asyncHandler');
const Shelter = require('../models/Shelter');
const { sortByDistance } = require('../utils/geo');

const listAll = asyncHandler(async (req, res) => {
  const data = await Shelter.find().sort({ name: 1 });
  res.json({ success: true, data });
});

const nearby = asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat ?? req.user?.latitude);
  const lon = Number(req.query.lon ?? req.user?.longitude);
  const shelters = await Shelter.find({ status: { $ne: 'CLOSED' } }).lean();
  const sorted = sortByDistance(shelters, lat, lon);
  res.json({ success: true, data: sorted.slice(0, 10) });
});

const createShelter = asyncHandler(async (req, res) => {
  const data = await Shelter.create(req.body);
  res.status(201).json({ success: true, data });
});

const updateShelter = asyncHandler(async (req, res) => {
  const data = await Shelter.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!data) return res.status(404).json({ success: false, message: 'Shelter not found' });
  res.json({ success: true, data });
});

const deleteShelter = asyncHandler(async (req, res) => {
  await Shelter.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Shelter deleted' });
});

module.exports = { listAll, nearby, createShelter, updateShelter, deleteShelter };
