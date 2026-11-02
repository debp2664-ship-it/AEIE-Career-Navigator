const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'aeie_jwt_super_secret_key_2026_2030';

/**
 * Protect routes - verifies JWT in Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if user exists in MongoDB or fallback store
      let user = null;
      try {
        user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        // Fallback store lookup if MongoDB offline
        if (global.__inMemoryUsers && global.__inMemoryUsers[decoded.id]) {
          const u = global.__inMemoryUsers[decoded.id];
          user = {
            _id: u._id,
            id: u._id,
            name: u.name,
            email: u.email,
            college: u.college,
            department: u.department,
            batch: u.batch,
            currentSemester: u.currentSemester,
          };
        }
      }

      if (!user) {
        // Check fallback store
        if (global.__inMemoryUsers && global.__inMemoryUsers[decoded.id]) {
          const u = global.__inMemoryUsers[decoded.id];
          user = {
            _id: u._id,
            id: u._id,
            name: u.name,
            email: u.email,
            college: u.college,
            department: u.department,
            batch: u.batch,
            currentSemester: u.currentSemester,
          };
        } else {
          return res.status(401).json({
            success: false,
            message: 'Not authorized, user account not found',
          });
        }
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired session token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, access token missing',
    });
  }
};

/**
 * Generate signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

module.exports = { protect, generateToken };

