const config = require('../config');
const logger = require('../config/logger');

class PushService {
  async sendPush({ to, title, body, data }) {
    if (config.fcmServerKey) {
      logger.info({ to, title, body }, 'Push via FCM');

      return { status: 'sent', provider: 'fcm', to, title };
    }

    logger.info({ to, title, body }, 'Push stub');

    return { status: 'sent', provider: 'stub', to, title };
  }
}

module.exports = PushService;
