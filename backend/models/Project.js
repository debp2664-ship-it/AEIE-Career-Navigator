const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      trim: true, // e.g. "proj-y1-1"
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'C Language & CLI',
        'Python Scripting & Telemetry',
        'Embedded Instrumentation',
        'Virtual Instrument GUI',
        'Industrial IoT & Cloud',
        'Control Systems & Embedded C',
        'Capstone Engineering',
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    techStack: [{ type: String, trim: true }],
    deliverables: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Capstone'],
      default: 'Intermediate',
    },
    hardwareTools: [{ type: String, trim: true }],
    softwareTools: [{ type: String, trim: true }],
    githubTemplateUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);

