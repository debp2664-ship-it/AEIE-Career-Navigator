const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Array of completed subject IDs (e.g. ['y1-s1-1', 'y1-s1-2'])
    completedSubjects: [{ type: String, trim: true }],

    // Array of completed project IDs (e.g. ['proj-y1-1', 'proj-y2-1'])
    completedProjects: [{ type: String, trim: true }],

    // Array of completed semester numbers (e.g. [1, 2])
    completedSemesters: [{ type: Number, min: 1, max: 8 }],

    // Array of completed skill names / identifiers
    completedSkills: [{ type: String, trim: true }],

    // Array of saved / completed learning resource titles
    completedResources: [{ type: String, trim: true }],
    savedResources: [{ type: String, trim: true }],

    // Internship preparation milestones
    completedInternshipTasks: [{ type: String, trim: true }],
    internshipProgress: [{ type: String, trim: true }],

    // GATE preparation milestones
    gateProgress: [{ type: String, trim: true }],

    // Student's personal study notes & goals
    personalNotes: {
      type: String,
      default: '',
      maxlength: [10000, 'Personal notes cannot exceed 10000 characters'],
    },

    // UI & Dashboard Preferences
    themePreference: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
    },
    dashboardPreferences: {
      showAnalytics: { type: Boolean, default: true },
      preferredYearView: { type: String, default: 'year-1' },
      targetCGPA: { type: Number, default: 8.5 },
    },

    // Timestamp of last active interaction
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },

    // Computed overall percentage (0-100)
    overallPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Detailed metrics summary
    metrics: {
      totalItems: { type: Number, default: 44 },
      completedCount: { type: Number, default: 0 },
      year1Percentage: { type: Number, default: 0 },
      year2Percentage: { type: Number, default: 0 },
      year3Percentage: { type: Number, default: 0 },
      year4Percentage: { type: Number, default: 0 },
      projectsPercentage: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Method to recalculate metrics before saving
userProgressSchema.methods.recalculateMetrics = function () {
  const totalItems = 44; // 38 subjects + 6 projects
  const checkedSubjects = this.completedSubjects ? this.completedSubjects.length : 0;
  const checkedProjects = this.completedProjects ? this.completedProjects.length : 0;
  const totalCompleted = checkedSubjects + checkedProjects;

  this.overallPercentage = Math.min(100, Math.round((totalCompleted / totalItems) * 100));

  // Compute breakdown
  const y1Count = (this.completedSubjects || []).filter((s) => s.startsWith('y1-')).length +
                  (this.completedProjects || []).filter((p) => p.startsWith('proj-y1-')).length;
  const y2Count = (this.completedSubjects || []).filter((s) => s.startsWith('y2-')).length +
                  (this.completedProjects || []).filter((p) => p.startsWith('proj-y2-')).length;
  const y3Count = (this.completedSubjects || []).filter((s) => s.startsWith('y3-')).length +
                  (this.completedProjects || []).filter((p) => p.startsWith('proj-y3-')).length;
  const y4Count = (this.completedSubjects || []).filter((s) => s.startsWith('y4-')).length;

  this.metrics = {
    totalItems,
    completedCount: totalCompleted,
    year1Percentage: Math.round((y1Count / 11) * 100),
    year2Percentage: Math.round((y2Count / 13) * 100),
    year3Percentage: Math.round((y3Count / 12) * 100),
    year4Percentage: Math.round((y4Count / 8) * 100),
    projectsPercentage: Math.round((checkedProjects / 6) * 100),
  };

  this.lastActiveDate = new Date();
};

module.exports = mongoose.model('UserProgress', userProgressSchema);
