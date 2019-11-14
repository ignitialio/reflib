const redisCfg = require('./redis')

module.exports = {
  settings: {
    rpcTimeout: 10000,
    _unified: true
  },
  options: {
    apigateway: {
      namespace: process.env.IIOS_NAMESPACE || 'reflib',
      /* calling timeout for pub/sub mode */
      timeout: process.env.IIOS_RPC_TIMEOUT || 5000,
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
    myunified: {
      someConfiguration: 'that\'s all folks !'
    }
  }
}
