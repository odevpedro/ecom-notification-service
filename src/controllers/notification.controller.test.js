const request = require('supertest');
const app = require('../app');

describe('NotificationController', () => {
  it('returns 200 for valid email', async () => {
    const res = await request(app)
      .post('/api/notifications/send')
      .send({ type: 'email', to: 'a@b.com', subject: 'Hi', body: 'Hello' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('sent');
  });

  it('returns 400 for missing body', async () => {
    const res = await request(app)
      .post('/api/notifications/send')
      .send({ type: 'email', to: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid type', async () => {
    const res = await request(app)
      .post('/api/notifications/send')
      .send({ type: 'fax', to: 'a@b.com', body: 'Hello' });
    expect(res.status).toBe(400);
  });

  it('returns 200 for sms stub', async () => {
    const res = await request(app)
      .post('/api/notifications/send')
      .send({ type: 'sms', to: '11999999999', body: 'Hello' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('stub');
  });
});
