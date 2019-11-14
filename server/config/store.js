const fs = require('fs')

const IIOS_S3_ENDPOINT = process.env.IIOS_S3_ENDPOINT || 'localhost'
const IIOS_S3_SECURE = process.env.IIOS_S3_SECURE ? (process.env.IIOS_S3_SECURE === 'true') : false
const IIOS_S3_PORT = process.env.IIOS_S3_PORT ? parseInt(process.env.IIOS_S3_PORT) : undefined
const IIOS_S3_BUCKET = process.env.IIOS_S3_BUCKET || 'reflib'
const IIOS_S3_REGION = process.env.IIOS_S3_REGION || 'eu-west-3'

// BUCKET endPoint
var IIOS_S3_BUCKET_ENDPOINT = ''

if (IIOS_S3_ENDPOINT.match('.amazonaws.')) {
  IIOS_S3_BUCKET_ENDPOINT = (IIOS_S3_SECURE ? 'https://' : 'http://') + IIOS_S3_BUCKET + '.' +
    IIOS_S3_ENDPOINT
} else {
  IIOS_S3_BUCKET_ENDPOINT = (IIOS_S3_SECURE ? 'https://' : 'http://') + IIOS_S3_ENDPOINT +
    (IIOS_S3_PORT ? ':' + IIOS_S3_PORT : '') + '/' + IIOS_S3_BUCKET
}

// ACCESS secrets
var IIOS_S3_ACCESS_KEY_ID = process.env.IIOS_S3_ACCESS_KEY_ID
var IIOS_S3_SECRET_ACCESS_KEY = process.env.IIOS_S3_SECRET_ACCESS_KEY

// get from docker secrets
if (!IIOS_S3_ACCESS_KEY_ID || !IIOS_S3_SECRET_ACCESS_KEY) {
  try {
    IIOS_S3_ACCESS_KEY_ID = fs.readFileSync('/run/secrets/s3_access_key_id', 'utf8').replace('\n', '')
    IIOS_S3_SECRET_ACCESS_KEY = fs.readFileSync('/run/secrets/s3_secret_access_key', 'utf8').replace('\n', '')
  } catch (err) {
    console.log('failed to get S3 credentials from file')
    // console.log('<' + process.env.IIOS_S3_ACCESS_KEY_ID + ':' + process.env.IIOS_S3_SECRET_ACCESS_KEY + '>')
  }
}

module.exports = {
  minio: {
    endPoint: IIOS_S3_ENDPOINT,
    useSSL: IIOS_S3_SECURE,
    accessKey: IIOS_S3_ACCESS_KEY_ID,
    secretKey: IIOS_S3_SECRET_ACCESS_KEY,
    port: IIOS_S3_PORT,
    region: IIOS_S3_REGION
  },
  bucket: {
    name: IIOS_S3_BUCKET,
    region: IIOS_S3_REGION,
    endPoint: IIOS_S3_BUCKET_ENDPOINT,
    _unified: true
  }
}
