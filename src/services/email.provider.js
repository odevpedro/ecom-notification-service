const nodemailer = require('nodemailer');
const emailConfig = require('./email.config');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
  }
  return transporter;
}

function isConfigured() {
  return !!emailConfig.user;
}

async function sendMail({ to, subject, body, html }) {
  if (!isConfigured()) {
    throw new Error('SMTP not configured');
  }

  const mailOptions = {
    from: emailConfig.fromName
      ? `"${emailConfig.fromName}" <${emailConfig.fromEmail}>`
      : emailConfig.fromEmail,
    to,
    subject,
    text: body,
    html: html || body,
  };

  const info = await getTransporter().sendMail(mailOptions);
  return {
    status: 'sent',
    provider: 'smtp',
    to,
    subject,
    messageId: info.messageId,
  };
}

module.exports = { sendMail, isConfigured };
