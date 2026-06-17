const config = require('../config');

class PushService {
  async sendPush({ to, title, body, data }) {
    if (config.fcmServerKey) {
      console.log('--- Push via FCM ---');
      console.log(`To:    ${to}`);
      console.log(`Title: ${title}`);
      console.log(`Body:  ${body}`);
      console.log('---------------------');

      return { status: 'sent', provider: 'fcm', to, title };
    }

    console.log('--- Push Stub ---');
    console.log(`To:    ${to}`);
    console.log(`Title: ${title}`);
    console.log(`Body:  ${body}`);
    console.log('-----------------');

    return { status: 'sent', provider: 'stub', to, title };
  }
}

module.exports = PushService;
