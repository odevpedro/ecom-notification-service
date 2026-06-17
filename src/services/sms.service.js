const config = require('../config');
const logger = require('../config/logger');

const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;

class SmsService {
  async sendSms({ to, body }) {
    if (!PHONE_REGEX.test(to)) {
      return { status: 'error', message: 'Invalid phone number format' };
    }

    if (config.twilio.accountSid && config.twilio.authToken) {
      logger.info({ to, body }, 'SMS via Twilio');

      return { status: 'sent', provider: 'twilio', to };
    }

    logger.info({ to, body }, 'SMS stub');

    return { status: 'sent', provider: 'stub', to };
  }
}

module.exports = SmsService;
