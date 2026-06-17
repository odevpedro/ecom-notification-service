const config = require('../config');
const emailProvider = require('./email.provider');

class EmailService {
  async send({ to, subject, body }) {
    if (emailProvider.isConfigured()) {
      return emailProvider.sendMail({ to, subject, body });
    }

    console.log('--- Email Stub ---');
    console.log(`From:    ${config.fromEmail}`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:    ${body}`);
    console.log('------------------');

    return { status: 'sent', provider: 'stub', to, subject };
  }
}

module.exports = EmailService;
