const config = require('../config');

module.exports = {
  host: config.smtp.host,
  port: config.smtp.port,
  user: config.smtp.user,
  pass: config.smtp.pass,
  fromEmail: config.fromEmail,
  fromName: config.smtpFromName,
};
