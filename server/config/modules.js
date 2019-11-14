const fs = require('fs')

const redisCfg = require('./redis')

// SMTP secrets
var IIOS_EMAILER_SMTP_PASS = process.env.IIOS_EMAILER_SMTP_PASS

// get from docker secrets
if (!IIOS_EMAILER_SMTP_PASS) {
  try {
    IIOS_EMAILER_SMTP_PASS = fs.readFileSync('/run/secrets/emailer_smtp_pass', 'utf8').replace('\n', '')
  } catch (err) {}
}

module.exports = {
  gateway: {
    namespace: process.env.IIOS_NAMESPACE || 'reflib',
    /* calling timeout for pub/sub mode */
    timeout: 5000,
    connector: {
      redis: {
        encoder: 'bson',
        sentinels: redisCfg.IIOS_REDIS_SENTINELS,
        host: redisCfg.IIOS_REDIS_HOST,
        port: redisCfg.IIOS_REDIS_PORT,
        db: redisCfg.IIOS_REDIS_DB
      }
    }
  },
  emailer: {
    smtp: {
      host: process.env.IIOS_EMAILER_SMTP_HOST || 'mail.ignitial.fr', /* SMTP host */
      port: process.env.IIOS_EMAILER_SMTP_PORT || 25, /* SMTP port */
      secure: process.env.IIOS_EMAILER_SMTP_SECURE === 'true', /* true for 465, false for other ports */
      auth: {
        user: process.env.IIOS_EMAILER_SMTP_USER, /* SMTP server user account */
        pass: IIOS_EMAILER_SMTP_PASS /* SMTP server user password */
      },
      logger: false,
      debug: false
    },
    mail: {
      from: 'Systra Support <no-reply@ignitial.fr>'
    }
  }
}
