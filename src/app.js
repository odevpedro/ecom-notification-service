const express = require('express');
const requestId = require('./middleware/response');
const errorHandler = require('./middleware/error-handler');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

app.use(express.json());
app.use(requestId);

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'notification' }));
app.get('/live', (_req, res) => res.json({ status: 'alive' }));
app.get('/ready', (_req, res) => res.json({ status: 'ready' }));

app.use('/api/notifications', notificationRoutes);
app.use(errorHandler);

module.exports = app;
