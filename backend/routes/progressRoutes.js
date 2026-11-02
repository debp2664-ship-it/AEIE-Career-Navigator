const express = require('express');
const router = express.Router();
const {
  getUserProgress,
  updateTaskProgress,
  syncFullProgress,
  resetProgress,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateProgressUpdate,
} = require('../middleware/validationMiddleware');

router.use(protect); // All progress routes require authentication

router.get('/', getUserProgress);
router.post('/task', validateProgressUpdate, updateTaskProgress);
router.put('/sync', syncFullProgress);
router.delete('/reset', resetProgress);

module.exports = router;

