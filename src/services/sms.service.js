const config = require('../config');

const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;

class SmsService {
  async sendSms({ to, body }) {
    if (!PHONE_REGEX.test(to)) {
      return { status: 'error', message: 'Invalid phone number format' };
    }

    if (config.twilio.accountSid && config.twilio.authToken) {
      console.log('--- SMS via Twilio ---');
      console.log(`To:   ${to}`);
      console.log(`Body: ${body}`);
      console.log('----------------------');

      return { status: 'sent', provider: 'twilio', to };
    }

    console.log('--- SMS Stub ---');
    console.log(`To:   ${to}`);
    console.log(`Body: ${body}`);
    console.log('----------------');

    return { status: 'sent', provider: 'stub', to };
  }
}

module.exports = SmsService;
