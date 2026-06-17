const config = require('../config');
const logger = require('../config/logger');
const emailProvider = require('./email.provider');

class EmailService {
  async send({ to, subject, body }) {
    if (emailProvider.isConfigured()) {
      return emailProvider.sendMail({ to, subject, body });
    }

    logger.info({ from: config.fromEmail, to, subject, body }, 'Email stub');

    return { status: 'sent', provider: 'stub', to, subject };
  }
}

module.exports = EmailService;
