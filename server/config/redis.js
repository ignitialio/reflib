exports.IIOS_REDIS_HOST = process.env.IIOS_REDIS_HOST || '127.0.0.1'
exports.IIOS_REDIS_PORT = process.env.IIOS_REDIS_PORT ? parseInt(process.env.IIOS_REDIS_PORT) : 6379
exports.IIOS_REDIS_DB = process.env.IIOS_REDIS_DB || 0

let redis_sentinels

if (process.env.IIOS_REDIS_SENTINELS) {
  redis_sentinels = []
  let sentinels = process.env.IIOS_REDIS_SENTINELS.split(',')
  for (let s of sentinels) {
    redis_sentinels.push({ host: s.split(':')[0], port: s.split(':')[1] })
  }
}

exports.IIOS_REDIS_SENTINELS = redis_sentinels
