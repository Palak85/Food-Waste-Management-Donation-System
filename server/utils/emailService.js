const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email using SendGrid
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email content
 * @param {string} html - HTML email content (optional)
 * @returns {Promise<boolean>} - Success status
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL, // This must be a verified sender in your SendGrid account
      subject,
      text,
      html: html || text,
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};

module.exports = { sendEmail };
