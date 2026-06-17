const Joi = require('joi');
const EmailService = require('../services/email.service');
const SmsService = require('../services/sms.service');
const PushService = require('../services/push.service');

const sendSchema = Joi.object({
  type: Joi.string().valid('email', 'sms', 'push').required(),
  to: Joi.string().required(),
  subject: Joi.string().when('type', { is: 'email', then: Joi.required(), otherwise: Joi.optional() }),
  body: Joi.string().required(),
});

class NotificationController {
  constructor() {
    this.emailService = new EmailService();
    this.smsService = new SmsService();
    this.pushService = new PushService();
  }

  async send(req, res) {
    const { error, value } = sendSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.type === 'email') {
      const result = await this.emailService.send({
        to: value.to,
        subject: value.subject,
        body: value.body,
      });
      return res.json(result);
    }

    if (value.type === 'sms') {
      const result = await this.smsService.sendSms({
        to: value.to,
        body: value.body,
      });
      return res.json(result);
    }

    if (value.type === 'push') {
      const result = await this.pushService.sendPush({
        to: value.to,
        title: value.subject || 'Notification',
        body: value.body,
      });
      return res.json(result);
    }

    return res.json({ status: 'stub', type: value.type, message: 'not implemented' });
  }
}

module.exports = NotificationController;
