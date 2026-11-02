/**
 * Request validation middleware functions
 */

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be at least 2 characters long',
    });
  }

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  next();
};

const validateProgressUpdate = (req, res, next) => {
  const { taskId, action } = req.body;

  if (!taskId || typeof taskId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'taskId is required and must be a string',
    });
  }

  if (action && !['toggle', 'check', 'uncheck'].includes(action)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid action. Allowed values: toggle, check, uncheck',
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProgressUpdate,
};

