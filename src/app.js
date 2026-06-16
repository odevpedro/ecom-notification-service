const express = require('express');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

app.use(express.json());
app.use('/api/notifications', notificationRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = app;
