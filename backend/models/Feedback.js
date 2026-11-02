const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
      minlength: [3, 'Subject must be at least 3 characters long'],
      maxlength: [150, 'Subject cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a feedback category'],
      enum: {
        values: ['Suggestion', 'Bug Report', 'General Feedback'],
        message: 'Category must be Suggestion, Bug Report, or General Feedback',
      },
      default: 'General Feedback',
    },
    message: {
      type: String,
      required: [true, 'Please enter your message'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters long'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailError: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Reviewed', 'Resolved'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);

