const UserProgress = require('../models/UserProgress');
const { isDbReady } = require('../config/db');

// Helper to compute metrics on plain object (fallback mode)
function computeMetrics(progress) {
  const totalItems = 44;
  const subjects = progress.completedSubjects || [];
  const projects = progress.completedProjects || [];
  const completedCount = subjects.length + projects.length;

  const y1Count = subjects.filter((s) => s.startsWith('y1-')).length +
                  projects.filter((p) => p.startsWith('proj-y1-')).length;
  const y2Count = subjects.filter((s) => s.startsWith('y2-')).length +
                  projects.filter((p) => p.startsWith('proj-y2-')).length;
  const y3Count = subjects.filter((s) => s.startsWith('y3-')).length +
                  projects.filter((p) => p.startsWith('proj-y3-')).length;
  const y4Count = subjects.filter((s) => s.startsWith('y4-')).length;

  return {
    totalItems,
    completedCount,
    year1Percentage: Math.round((y1Count / 11) * 100),
    year2Percentage: Math.round((y2Count / 13) * 100),
    year3Percentage: Math.round((y3Count / 12) * 100),
    year4Percentage: Math.round((y4Count / 8) * 100),
    projectsPercentage: Math.round((projects.length / 6) * 100),
  };
}

/**
 * @desc    Get user's complete roadmap progress
 * @route   GET /api/progress
 * @access  Private
 */
const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    let progress = null;
    let usingMongo = isDbReady();

    if (usingMongo) {
      try {
        progress = await UserProgress.findOne({ user: userId });
        if (!progress) {
          progress = await UserProgress.create({
            user: userId,
            completedSubjects: [],
            completedProjects: [],
            completedSemesters: [],
            completedSkills: [],
            completedResources: [],
            completedInternshipTasks: [],
          });
        }
      } catch (dbErr) {
        usingMongo = false;
      }
    }

    if (!usingMongo) {
      if (!global.__inMemoryProgress) global.__inMemoryProgress = {};
      if (!global.__inMemoryProgress[userId]) {
        global.__inMemoryProgress[userId] = {
          user: userId,
          completedSubjects: [],
          completedProjects: [],
          completedSemesters: [],
          completedSkills: [],
          completedResources: [],
          completedInternshipTasks: [],
          internshipProgress: [],
          gateProgress: [],
          personalNotes: '',
          themePreference: 'dark',
          dashboardPreferences: {
            showAnalytics: true,
            preferredYearView: 'year-1',
            targetCGPA: 8.5,
          },
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
      progress = global.__inMemoryProgress[userId];
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle or set single task completion (Subject or Project)
 * @route   POST /api/progress/task
 * @access  Private
 */
const updateTaskProgress = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { taskId, action } = req.body; // action: 'check', 'uncheck', or 'toggle'

    const isProject = taskId.startsWith('proj-');
    let usingMongo = isDbReady();
    let progress = null;

    if (usingMongo) {
      try {
        progress = await UserProgress.findOne({ user: userId });
        if (!progress) {
          progress = new UserProgress({ user: userId });
        }

        const targetArray = isProject ? progress.completedProjects : progress.completedSubjects;
        const index = targetArray.indexOf(taskId);
        const isCurrentlyChecked = index > -1;

        let shouldCheck = !isCurrentlyChecked;
        if (action === 'check') shouldCheck = true;
        if (action === 'uncheck') shouldCheck = false;

        if (shouldCheck && !isCurrentlyChecked) {
          targetArray.push(taskId);
        } else if (!shouldCheck && isCurrentlyChecked) {
          targetArray.splice(index, 1);
        }

        progress.recalculateMetrics();
        await progress.save();
      } catch (dbErr) {
        usingMongo = false;
      }
    }

    if (!usingMongo) {
      if (!global.__inMemoryProgress) global.__inMemoryProgress = {};
      if (!global.__inMemoryProgress[userId]) {
        global.__inMemoryProgress[userId] = {
          user: userId,
          completedSubjects: [],
          completedProjects: [],
          completedSemesters: [],
          completedSkills: [],
          completedResources: [],
          completedInternshipTasks: [],
        };
      }

      progress = global.__inMemoryProgress[userId];
      const targetArray = isProject ? progress.completedProjects : progress.completedSubjects;
      const index = targetArray.indexOf(taskId);
      const isCurrentlyChecked = index > -1;

      let shouldCheck = !isCurrentlyChecked;
      if (action === 'check') shouldCheck = true;
      if (action === 'uncheck') shouldCheck = false;

      if (shouldCheck && !isCurrentlyChecked) {
        targetArray.push(taskId);
      } else if (!shouldCheck && isCurrentlyChecked) {
        targetArray.splice(index, 1);
      }

      progress.metrics = computeMetrics(progress);
      progress.overallPercentage = Math.round((progress.metrics.completedCount / 44) * 100);
    }

    res.json({
      success: true,
      message: `Task ${taskId} updated successfully`,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk sync progress (e.g. migrate guest localStorage upon login, save notes, theme, gate)
 * @route   PUT /api/progress/sync
 * @access  Private
 */
const syncFullProgress = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      completedSubjects,
      completedProjects,
      completedSemesters,
      completedSkills,
      completedResources,
      completedInternshipTasks,
      internshipProgress,
      gateProgress,
      personalNotes,
      themePreference,
      dashboardPreferences,
    } = req.body;

    let progress = null;
    let usingMongo = isDbReady();

    if (usingMongo) {
      try {
        progress = await UserProgress.findOne({ user: userId });
        if (!progress) {
          progress = new UserProgress({ user: userId });
        }

        if (Array.isArray(completedSubjects)) progress.completedSubjects = [...new Set(completedSubjects)];
        if (Array.isArray(completedProjects)) progress.completedProjects = [...new Set(completedProjects)];
        if (Array.isArray(completedSemesters)) progress.completedSemesters = [...new Set(completedSemesters)];
        if (Array.isArray(completedSkills)) progress.completedSkills = [...new Set(completedSkills)];
        if (Array.isArray(completedResources)) progress.completedResources = [...new Set(completedResources)];
        if (Array.isArray(completedInternshipTasks)) progress.completedInternshipTasks = [...new Set(completedInternshipTasks)];
        if (Array.isArray(internshipProgress)) progress.internshipProgress = [...new Set(internshipProgress)];
        if (Array.isArray(gateProgress)) progress.gateProgress = [...new Set(gateProgress)];
        if (typeof personalNotes === 'string') progress.personalNotes = personalNotes;
        if (themePreference && ['dark', 'light'].includes(themePreference)) progress.themePreference = themePreference;
        if (dashboardPreferences && typeof dashboardPreferences === 'object') {
          progress.dashboardPreferences = { ...progress.dashboardPreferences, ...dashboardPreferences };
        }

        progress.recalculateMetrics();
        await progress.save();
      } catch (dbErr) {
        usingMongo = false;
      }
    }

    if (!usingMongo) {
      if (!global.__inMemoryProgress) global.__inMemoryProgress = {};
      const existing = global.__inMemoryProgress[userId] || {};
      progress = {
        user: userId,
        completedSubjects: Array.isArray(completedSubjects) ? [...new Set(completedSubjects)] : (existing.completedSubjects || []),
        completedProjects: Array.isArray(completedProjects) ? [...new Set(completedProjects)] : (existing.completedProjects || []),
        completedSemesters: Array.isArray(completedSemesters) ? [...new Set(completedSemesters)] : (existing.completedSemesters || []),
        completedSkills: Array.isArray(completedSkills) ? [...new Set(completedSkills)] : (existing.completedSkills || []),
        completedResources: Array.isArray(completedResources) ? [...new Set(completedResources)] : (existing.completedResources || []),
        completedInternshipTasks: Array.isArray(completedInternshipTasks) ? [...new Set(completedInternshipTasks)] : (existing.completedInternshipTasks || []),
        internshipProgress: Array.isArray(internshipProgress) ? [...new Set(internshipProgress)] : (existing.internshipProgress || []),
        gateProgress: Array.isArray(gateProgress) ? [...new Set(gateProgress)] : (existing.gateProgress || []),
        personalNotes: typeof personalNotes === 'string' ? personalNotes : (existing.personalNotes || ''),
        themePreference: themePreference || existing.themePreference || 'dark',
        dashboardPreferences: dashboardPreferences || existing.dashboardPreferences || {},
        lastActiveDate: new Date(),
      };
      progress.metrics = computeMetrics(progress);
      progress.overallPercentage = Math.round((progress.metrics.completedCount / 44) * 100);
      global.__inMemoryProgress[userId] = progress;
    }

    res.json({
      success: true,
      message: 'Progress synchronized successfully with cloud database',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset all user progress
 * @route   DELETE /api/progress/reset
 * @access  Private
 */
const resetProgress = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    try {
      let progress = await UserProgress.findOne({ user: userId });
      if (progress) {
        progress.completedSubjects = [];
        progress.completedProjects = [];
        progress.completedSemesters = [];
        progress.completedSkills = [];
        progress.completedResources = [];
        progress.completedInternshipTasks = [];
        progress.recalculateMetrics();
        await progress.save();
      }
    } catch (dbErr) {
      if (global.__inMemoryProgress && global.__inMemoryProgress[userId]) {
        global.__inMemoryProgress[userId] = {
          user: userId,
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
    }

    res.json({
      success: true,
      message: 'User roadmap progress reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProgress,
  updateTaskProgress,
  syncFullProgress,
  resetProgress,
};
