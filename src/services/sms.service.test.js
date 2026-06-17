const SmsService = require('./sms.service');

describe('SmsService', () => {
  it('sends sms and returns status', async () => {
    const service = new SmsService();
    const result = await service.sendSms({
      to: '11999999999',
      body: 'Hello',
    });
    expect(result.status).toBe('sent');
    expect(result.to).toBe('11999999999');
  });

  it('rejects invalid phone number', async () => {
    const service = new SmsService();
    const result = await service.sendSms({
      to: 'abc',
      body: 'Hello',
    });
    expect(result.status).toBe('error');
  });
});
