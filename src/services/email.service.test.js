const EmailService = require('./email.service');

describe('EmailService', () => {
  it('sends email and returns status', async () => {
    const service = new EmailService();
    const result = await service.send({
      to: 'test@email.com',
      subject: 'Test',
      body: 'Hello',
    });
    expect(result.status).toBe('sent');
    expect(result.to).toBe('test@email.com');
    expect(result.subject).toBe('Test');
  });
});
