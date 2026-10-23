const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  listAll,
  nearby,
  createHospital,
  updateHospital,
  deleteHospital,
} = require('../controllers/hospitals.controller');

const router = express.Router();
router.get('/nearby', authenticate, nearby);
router.get('/', authenticate, listAll);
router.post('/', authenticate, authorize('ADMIN'), createHospital);
router.put('/:id', authenticate, authorize('ADMIN'), updateHospital);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteHospital);

module.exports = router;
