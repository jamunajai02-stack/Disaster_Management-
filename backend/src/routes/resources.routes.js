const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  listAll,
  nearby,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resources.controller');

const router = express.Router();
router.get('/nearby', authenticate, nearby);
router.get('/', authenticate, listAll);
router.post('/', authenticate, authorize('ADMIN'), createResource);
router.put('/:id', authenticate, authorize('ADMIN'), updateResource);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteResource);

module.exports = router;
