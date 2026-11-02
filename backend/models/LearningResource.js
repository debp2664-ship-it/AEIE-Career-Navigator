const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      enum: [
        'NPTEL',
        'Harvard CS50',
        'freeCodeCamp',
        'Wokwi',
        'Kaggle Learn',
        'GitHub Skills',
        'Python Docs',
        'Arduino Docs',
        'MATLAB Academy',
        'AICTE Internship Portal',
        'MIT OpenCourseWare',
        'Other',
      ],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Electronics & Simulators',
        'Computer Science',
        'Web & Coding',
        'Hardware Simulator',
        'Python & Data Science',
        'DevOps & Version Control',
        'Official Documentation',
        'Hardware Reference',
        'Simulation & Math',
        'Internship Portal',
      ],
    },
    semester: {
      type: Number,
      min: 0,
      max: 8,
      default: 0, // 0 means applicable across all semesters
    },
    skill: {
      type: String,
      trim: true,
    },
    badge: {
      type: String,
      default: 'Free Resource',
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LearningResource', learningResourceSchema);

