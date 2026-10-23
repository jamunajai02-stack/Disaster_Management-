const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  listAll,
  nearby,
  createShelter,
  updateShelter,
  deleteShelter,
} = require('../controllers/shelters.controller');

const router = express.Router();
router.get('/nearby', authenticate, nearby);
router.get('/', authenticate, listAll);
router.post('/', authenticate, authorize('ADMIN'), createShelter);
router.put('/:id', authenticate, authorize('ADMIN'), updateShelter);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteShelter);

module.exports = router;
