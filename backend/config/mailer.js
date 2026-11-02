const nodemailer = require('nodemailer');

const RECIPIENT_EMAIL = process.env.FEEDBACK_RECIPIENT_EMAIL || 'debdeveloper2207@gmail.com';

/**
 * Creates and verifies Nodemailer transport based on environment variables
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // If no SMTP credentials provided, return null (transparently handled)
  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port: port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user: user,
      pass: pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Sends feedback notification email to debdeveloper2207@gmail.com
 * @param {Object} feedback
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string, simulated?: boolean }>}
 */
const sendFeedbackEmail = async (feedback) => {
  const transporter = createTransporter();

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #070b14; color: #00d2ff; padding: 24px; text-align: center; }
        .header h2 { margin: 0; font-size: 20px; font-weight: 700; }
        .header p { margin: 6px 0 0; color: #94a3b8; font-size: 13px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #e0f2fe; color: #0369a1; margin-top: 8px; }
        .content { padding: 24px; }
        .field { margin-bottom: 16px; }
        .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
        .value { font-size: 15px; color: #0f172a; margin-top: 4px; }
        .message-box { background: #f1f5f9; border-left: 4px solid #00d2ff; padding: 14px 18px; border-radius: 4px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-top: 8px; }
        .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2>AEIE Career Navigator</h2>
          <p>New Student Feedback & Inquiry Received</p>
          <span class="badge">${feedback.category}</span>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Sender Name</div>
            <div class="value"><strong>${feedback.name}</strong></div>
          </div>
          <div class="field">
            <div class="label">Sender Email</div>
            <div class="value"><a href="mailto:${feedback.email}">${feedback.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Subject</div>
            <div class="value">${feedback.subject}</div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="message-box">${feedback.message}</div>
          </div>
          <div class="field">
            <div class="label">Submitted At</div>
            <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</div>
          </div>
        </div>
        <div class="footer">
          Delivered to Deb (AEIE Career Navigator Administrator)<br>
          Recipient: ${RECIPIENT_EMAIL}
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.warn(`[Mailer] Notice: SMTP credentials are not configured in .env. Feedback saved in database; email delivery skipped.`);
    return {
      success: false,
      simulated: true,
      reason: 'SMTP_CREDENTIALS_NOT_SET',
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"AEIE Career Navigator" <${process.env.SMTP_USER}>`,
      to: RECIPIENT_EMAIL,
      replyTo: feedback.email,
      subject: `[AEIE Navigator - ${feedback.category}] ${feedback.subject}`,
      html: emailHtml,
      text: `From: ${feedback.name} (${feedback.email})\nCategory: ${feedback.category}\nSubject: ${feedback.subject}\n\n${feedback.message}`,
    });

    console.log(`[Mailer] Email dispatched successfully to ${RECIPIENT_EMAIL}: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('[Mailer] Email delivery failed:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { sendFeedbackEmail, RECIPIENT_EMAIL };

