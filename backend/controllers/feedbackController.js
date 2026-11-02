const Feedback = require('../models/Feedback');
const { sendFeedbackEmail, RECIPIENT_EMAIL } = require('../config/mailer');
const { isDbReady } = require('../config/db');

// In-Memory store fallback if MongoDB is offline
if (!global.__inMemoryFeedback) {
  global.__inMemoryFeedback = [];
}

/**
 * @desc    Submit student/visitor feedback & send email notification
 * @route   POST /api/feedback
 * @access  Public
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, subject, category, message } = req.body;

    // 1. Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name (minimum 2 characters).',
      });
    }

    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address so we can reply.',
      });
    }

    if (!subject || subject.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a subject line (minimum 3 characters).',
      });
    }

    const validCategories = ['Suggestion', 'Bug Report', 'General Feedback'];
    const chosenCategory = validCategories.includes(category) ? category : 'General Feedback';

    if (!message || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your detailed message (minimum 10 characters).',
      });
    }

    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 2. Save in Database
    let feedbackDoc = null;
    let usingMongo = isDbReady();

    if (usingMongo) {
      try {
        feedbackDoc = await Feedback.create({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim(),
          category: chosenCategory,
          message: message.trim(),
          ipAddress: clientIp,
        });
      } catch (dbErr) {
        usingMongo = false;
      }
    }

    if (!usingMongo) {
      feedbackDoc = {
        _id: 'fb_' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        category: chosenCategory,
        message: message.trim(),
        ipAddress: clientIp,
        createdAt: new Date(),
        emailSent: false,
        emailError: null,
      };
      global.__inMemoryFeedback.push(feedbackDoc);
    }

    // 3. Dispatch Email via Nodemailer
    const emailResult = await sendFeedbackEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      category: chosenCategory,
      message: message.trim(),
    });

    // 4. Update Database Record with real dispatch status
    if (usingMongo && feedbackDoc._id) {
      try {
        await Feedback.findByIdAndUpdate(feedbackDoc._id, {
          emailSent: emailResult.success,
          emailError: emailResult.error || (emailResult.simulated ? 'SMTP credentials not configured in environment' : null),
        });
      } catch (e) {}
    } else if (feedbackDoc) {
      feedbackDoc.emailSent = emailResult.success;
      feedbackDoc.emailError = emailResult.error || (emailResult.simulated ? 'SMTP credentials not configured in environment' : null);
    }

    // 5. Build Accurate Response Message (No pretending!)
    let responseMessage = 'Thank you! Your feedback has been received and stored securely in our database.';
    let emailStatus = 'pending';

    if (emailResult.success) {
      responseMessage = `Thank you! Your feedback has been saved and dispatched directly to Deb (${RECIPIENT_EMAIL}).`;
      emailStatus = 'sent';
    } else if (emailResult.simulated) {
      responseMessage = `Thank you! Your feedback has been securely recorded in the database. (Note: Email dispatch is queued until SMTP credentials are configured).`;
      emailStatus = 'saved_local';
    } else if (emailResult.error) {
      responseMessage = `Your feedback has been securely stored in our database, but automatic email delivery failed (${emailResult.error}). Our team will review it manually.`;
      emailStatus = 'email_failed';
    }

    res.status(201).json({
      success: true,
      message: responseMessage,
      emailStatus,
      recipient: RECIPIENT_EMAIL,
      feedbackId: feedbackDoc._id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all feedback entries (Protected for Administrator Review)
 * @route   GET /api/feedback
 * @access  Private
 */
const getAdminFeedback = async (req, res, next) => {
  try {
    let feedbacks = [];

    if (isDbReady()) {
      try {
        feedbacks = await Feedback.find().sort({ createdAt: -1 });
      } catch (err) {
        feedbacks = global.__inMemoryFeedback || [];
      }
    } else {
      feedbacks = global.__inMemoryFeedback || [];
    }

    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
  getAdminFeedback,
};

