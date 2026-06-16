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
  nodeEnv: process.env.NODE_ENV || 'development',
};
