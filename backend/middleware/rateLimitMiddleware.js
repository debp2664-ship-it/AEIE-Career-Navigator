const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for feedback submissions to prevent spam
 * Max 5 submissions per 15 minutes per IP
 */
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many feedback submissions from this IP address. Please wait 15 minutes before submitting again.',
  },
});

/**
 * Rate limiter for login / registration endpoints
 * Max 15 attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

module.exports = { feedbackLimiter, authLimiter };

