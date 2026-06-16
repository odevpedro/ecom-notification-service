const { Router } = require('express');
const NotificationController = require('../controllers/notification.controller');

const router = Router();
const controller = new NotificationController();

router.post('/send', controller.send.bind(controller));

module.exports = router;
