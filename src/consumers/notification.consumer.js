const config = require('../config');

class NotificationConsumer {
  start() {
    if (!config.rabbitmqUrl || config.rabbitmqUrl === 'amqp://localhost:5672') {
      console.log('Notification Consumer: no RABBITMQ_URL configured, skipping');
      return;
    }

    console.log(`Notification Consumer: connecting to ${config.rabbitmqUrl}`);
    console.log('Notification Consumer: stub mode — not implemented');
  }
}

module.exports = NotificationConsumer;
