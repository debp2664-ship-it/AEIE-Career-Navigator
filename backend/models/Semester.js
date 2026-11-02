const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Core Theory',
      'Lab + Theory',
      'AEIE Pillar',
      'Hardware Core',
      'Software Ready',
      'GATE Core',
      'Heavy Weightage',
      'Core Instrumentation',
      'Plant Core',
      'Control Theory',
      'Embedded Industry',
      'Automation Essential',
      'Domain Specialty',
      'Placements',
      'Capstone Project',
      'Recruitment',
      'Higher Studies / PSU',
      'General Engineering',
    ],
    default: 'Core Theory',
  },
  topics: [{ type: String, trim: true }],
  importance: {
    type: String,
    default: 'High',
  },
});

const semesterSchema = new mongoose.Schema(
  {
    semesterNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 8,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true, // e.g. "2026–2027"
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    mentorTip: {
      type: String,
      trim: true,
    },
    subjects: [subjectSchema],
    technicalSkills: [{ type: String, trim: true }],
    programmingSkills: [{ type: String, trim: true }],
    aeieCoreSkills: [{ type: String, trim: true }],
    internshipTasks: [{ type: String, trim: true }],
    careerMilestones: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Semester', semesterSchema);

