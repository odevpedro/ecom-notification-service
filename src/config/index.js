require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3008,
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  fromEmail: process.env.FROM_EMAIL || 'noreply@ecom.local',
  smtpFromName: process.env.SMTP_FROM_NAME || 'Ecom Notification',
  nodeEnv: process.env.NODE_ENV || 'development',
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
  },
  fcmServerKey: process.env.FCM_SERVER_KEY,
};
