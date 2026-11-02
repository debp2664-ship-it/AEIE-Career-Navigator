const express = require('express');
const router = express.Router();
const {
  getAllResources,
  toggleResourceComplete,
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllResources);
router.post('/:id/toggle-complete', protect, toggleResourceComplete);

module.exports = router;

