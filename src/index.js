const app = require('./app');
const config = require('./config');
const NotificationConsumer = require('./consumers/notification.consumer');

const consumer = new NotificationConsumer();
consumer.start();

app.listen(config.port, () => {
  console.log(`Notification Service running on port ${config.port}`);
});
