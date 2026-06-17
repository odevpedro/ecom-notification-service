const amqp = require('amqplib');
const EmailService = require('../services/email.service');

class NotificationConsumer {
  constructor() {
    this.emailService = new EmailService();
    this.connection = null;
    this.channel = null;
  }

  async start() {
    if (!process.env.RABBITMQ_URL) {
      console.log('RABBITMQ_URL not set — Notification Consumer in stub mode');
      return;
    }

    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange('ecom.order', 'topic', { durable: true });
      await this.channel.assertQueue('ecom.notification.order', { durable: true });
      await this.channel.bindQueue('ecom.notification.order', 'ecom.order', 'order.#');

      this.channel.consume('ecom.notification.order', async (msg) => {
        if (msg === null) return;
        try {
          const event = JSON.parse(msg.content.toString());
          await this.handleEvent(event);
          this.channel.ack(msg);
        } catch (err) {
          console.error('Failed to process message:', err.message);
          this.channel.nack(msg, false, false);
        }
      });

      console.log('Notification Consumer connected to RabbitMQ');

      this.connection.on('close', () => {
        console.warn('RabbitMQ connection closed, retrying in 5s...');
        setTimeout(() => this.start(), 5000);
      });

      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err.message);
      });
    } catch (err) {
      console.warn('RabbitMQ connection failed — Notification Consumer in stub mode:', err.message);
    }
  }

  async handleEvent(event) {
    const email = `user-${event.userId}@ecom.local`;

    switch (event.eventType) {
      case 'created':
        await this.emailService.send({
          to: email,
          subject: 'Order Created',
          body: `Hi! Your order ${event.orderId} has been created and is being processed.`,
        });
        console.log('Order created email sent for:', event.orderId);
        break;

      case 'confirmed':
        await this.emailService.send({
          to: email,
          subject: 'Order Confirmed',
          body: `Great news! Your order ${event.orderId} for ${(event.totalCents / 100).toFixed(2)} has been confirmed.`,
        });
        console.log('Order confirmed email sent for:', event.orderId);
        break;

      default:
        console.log('Unknown event type:', event.eventType);
    }
  }
}

module.exports = NotificationConsumer;
