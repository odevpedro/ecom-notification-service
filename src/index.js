const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const NotificationConsumer = require('./consumers/notification.consumer');

const consumer = new NotificationConsumer();
consumer.start();

app.listen(config.port, () => {
  logger.info({ port: config.port }, 'Notification Service started');
});
