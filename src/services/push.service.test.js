const PushService = require('./push.service');

describe('PushService', () => {
  it('sends push and returns status', async () => {
    const service = new PushService();
    const result = await service.sendPush({
      to: 'device-token-123',
      title: 'Test',
      body: 'Hello',
    });
    expect(result.status).toBe('sent');
    expect(result.to).toBe('device-token-123');
  });
});
