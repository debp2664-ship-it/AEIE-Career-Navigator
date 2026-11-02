const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const { generateToken } = require('../middleware/authMiddleware');
const { isDbReady } = require('../config/db');

// In-Memory datastore fallback for environments without live MongoDB
if (!global.__inMemoryUsers) {
  global.__inMemoryUsers = {};
}
if (!global.__inMemoryProgress) {
  global.__inMemoryProgress = {};
}

/**
 * @desc    Register a new AEIE student
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, college, department, batch, currentSemester, careerGoal } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    let existingUser = null;
    let usingMongo = isDbReady();

    if (usingMongo) {
      try {
        existingUser = await User.findOne({ email: normalizedEmail });
      } catch (dbErr) {
        usingMongo = false;
      }
    }

    if (!usingMongo) {
      const usersList = Object.values(global.__inMemoryUsers);
      existingUser = usersList.find((u) => u.email === normalizedEmail);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please login.',
      });
    }

    let user;
    if (usingMongo) {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        college: college || 'University Institute of Technology (UIT), The University of Burdwan',
        department: department || 'Applied Electronics and Instrumentation Engineering (AEIE)',
        batch: batch || '2026–2030',
        currentSemester: currentSemester || 1,
        careerGoal: careerGoal || 'Core Electronics & Automation',
      });

      // Initialize Progress Document
      await UserProgress.create({
        user: user._id,
        completedSubjects: [],
        completedProjects: [],
        completedSemesters: [],
        completedSkills: [],
        completedResources: [],
        completedInternshipTasks: [],
        overallPercentage: 0,
      });
    } else {
      // In-memory fallback
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const fakeId = 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

      user = {
        _id: fakeId,
        id: fakeId,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        college: college || 'University Institute of Technology (UIT), The University of Burdwan',
        department: department || 'Applied Electronics and Instrumentation Engineering (AEIE)',
        batch: batch || '2026–2030',
        currentSemester: currentSemester || 1,
        careerGoal: careerGoal || 'Core Electronics & Automation',
        createdAt: new Date(),
      };

      global.__inMemoryUsers[fakeId] = user;
      global.__inMemoryProgress[fakeId] = {
        user: fakeId,
        completedSubjects: [],
        completedProjects: [],
        completedSemesters: [],
        completedSkills: [],
        completedResources: [],
        completedInternshipTasks: [],
        overallPercentage: 0,
        metrics: {
          totalItems: 44,
          completedCount: 0,
          year1Percentage: 0,
          year2Percentage: 0,
          year3Percentage: 0,
          year4Percentage: 0,
          projectsPercentage: 0,
        },
      };
    }

    const token = generateToken(user._id || user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to AEIE Career Navigator.',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        batch: user.batch,
        currentSemester: user.currentSemester,
        careerGoal: user.careerGoal,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    let user = null;
    let usingMongo = isDbReady();

    if (usingMongo) {
      try {
        user = await User.findOne({ email: normalizedEmail }).select('+password');
      } catch (dbErr) {
        usingMongo = false;
      }
    }

    if (!usingMongo) {
      const usersList = Object.values(global.__inMemoryUsers);
      user = usersList.find((u) => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    // Verify Password
    let isMatch = false;
    if (usingMongo && user.matchPassword) {
      isMatch = await user.matchPassword(password);
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const token = generateToken(user._id || user.id);

    // Fetch progress summary
    let progress = null;
    if (usingMongo) {
      try {
        progress = await UserProgress.findOne({ user: user._id || user.id });
      } catch (err) {
        progress = null;
      }
    } else {
      progress = global.__inMemoryProgress[user._id || user.id] || null;
    }

    res.json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        batch: user.batch,
        currentSemester: user.currentSemester,
        careerGoal: user.careerGoal,
      },
      progressSummary: progress
        ? {
            overallPercentage: progress.overallPercentage,
            completedCount: progress.metrics ? progress.metrics.completedCount : 0,
          }
        : { overallPercentage: 0, completedCount: 0 },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    let progress = null;
    try {
      progress = await UserProgress.findOne({ user: userId });
    } catch (err) {
      progress = global.__inMemoryProgress[userId] || null;
    }

    res.json({
      success: true,
      user: req.user,
      progress: progress || {
        overallPercentage: 0,
        completedSubjects: [],
        completedProjects: [],
        metrics: { totalItems: 44, completedCount: 0 },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, currentSemester, careerGoal, college } = req.body;

    let updatedUser = null;
    try {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...(name && { name: name.trim() }),
          ...(currentSemester && { currentSemester: Number(currentSemester) }),
          ...(careerGoal && { careerGoal: careerGoal.trim() }),
          ...(college && { college: college.trim() }),
        },
        { new: true, runValidators: true }
      ).select('-password');
    } catch (dbErr) {
      if (global.__inMemoryUsers[userId]) {
        const u = global.__inMemoryUsers[userId];
        if (name) u.name = name.trim();
        if (currentSemester) u.currentSemester = Number(currentSemester);
        if (careerGoal) u.careerGoal = careerGoal.trim();
        if (college) u.college = college.trim();
        updatedUser = u;
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser || req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
