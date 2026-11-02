const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAdminFeedback,
} = require('../controllers/feedbackController');
const { feedbackLimiter } = require('../middleware/rateLimitMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Public route to submit feedback (rate limited)
router.post('/', feedbackLimiter, submitFeedback);

// Admin-only route to review feedback (protected)
router.get('/', protect, getAdminFeedback);

module.exports = router;

