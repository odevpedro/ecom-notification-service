const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ecom-notification-service',
      version: '1.0.0',
      description: 'Envio de notificacoes transacionais — e-mail, SMS e push com suporte a consumo assincrono via RabbitMQ.',
    },
    servers: [{ url: 'http://localhost:3008', description: 'Development' }],
  },
  apis: ['./src/routes/*.js', './src/app.js'],
};

module.exports = swaggerJsDoc(options);
