const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Technical', 'Programming', 'AEIE Core', 'Tools & Instrumentation', 'Soft Skills & Aptitude'],
    },
    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    description: {
      type: String,
      trim: true,
    },
    proficiencyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Industry-Grade'],
      default: 'Intermediate',
    },
    targetIndustry: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema);

