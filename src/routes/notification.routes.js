const { Router } = require('express');
const NotificationController = require('../controllers/notification.controller');

const router = Router();
const controller = new NotificationController();

/**
 * @openapi
 * /api/notifications/send:
 *   post:
 *     tags: [Notifications]
 *     summary: Envia uma notificacao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, to]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [email, sms, push]
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notificacao enviada
 *       400:
 *         description: Dados invalidos
 */
router.post('/send', controller.send.bind(controller));

module.exports = router;
