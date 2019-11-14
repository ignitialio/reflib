const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

function envBrowseAndReplace(config) {
  for (let prop in config) {
    if (typeof config[prop] !== 'string' && typeof config[prop] !== 'number') {
      config[prop] = envBrowseAndReplace(config[prop])
    } else {
      if (typeof config[prop] === 'string') {
        let envVarMatch = config[prop].match(/env\((.*?)\)/)
        if (envVarMatch) {
          config[prop] = process.env[envVarMatch[1]]
        }
      }
    }
  }

  return config
}

let generatedConfigPath = path.join(process.cwd(), 'server', 'config', 'generated', 'config.json')
if (fs.existsSync(generatedConfigPath)) {
  let config = JSON.parse(fs.readFileSync(generatedConfigPath, 'utf8'))
  config = envBrowseAndReplace(config)
  console.log('WARNING: using YAML configuration')
  module.exports = config
  return
}

console.log('WARNING: generated file [' + generatedConfigPath + '] does not exist. switch to env config')

const i18n = YAML.parse(fs.readFileSync(path.join(__dirname, '../../config/i18n.yaml'), 'utf8'))

var IIOS_SERVER_PORT = process.env.NODE_ENV === 'production' ? 8080 : 4093

if (process.env.IIOS_SERVER_PORT) {
  IIOS_SERVER_PORT = process.env.IIOS_SERVER_PORT
}

module.exports = {
  server: {
    port: IIOS_SERVER_PORT,
    path: process.env.IIOS_SERVER_PATH || './dist',
    filesDropPath: process.env.IIOS_DROP_FILES_PATH || './dropped',
    corsEnabled: false
  },
  rest: {
    logLevel: process.env.IIOS_REST_LOGLEVEL || 'error'
  },
  logout: {
    timeout: 15, /* minutes */
    _unified: true
  },
  store: require('./store'),
  modules: require('./modules'),
  /* data service information */
  data: {
    /* name of the main service that provides data access */
    service: 'dlake',
    /* additional collections */
    collections: [{
      name: 'schemas',
      options: {
        indexes: [
          {
            key: 'name',
            type: -1,
            options: {
              name: 'name_desc',
              unique: true
            }
          }
        ]
      }
    }, {
      name: 'notifications'
    }, {
      name: 'connections'
    }, {
      /* example */
      name: 'myitems',
      options: {
        grants: {
          __privileged__: {
            'dlake:myitems': {
              'create:any': [ '*' ],
              'read:any': [ '*' ],
              'update:any': [ '*' ],
              'delete:any': [ '*' ]
            }
          },
          admin: {
            'dlake:myitems': {
              'create:any': [ '*' ],
              'read:any': [ '*' ],
              'update:any': [ '*' ],
              'delete:any': [ '*' ]
            }
          },
          user: {
            'dlake:myitems': {
              'create:any': [ '*' ],
              'read:any': [ '*' ],
              'update:any': [ '*' ],
              'delete:any': [ '*' ]
            }
          },
          anonymous: {
            'dlake:myitems': {
              'read:any': [ '*' ]
            }
          }
        }
      }
    }],
    _unified: true
  },
  /* auth service information */
  auth: {
    /* name of the main service that provides authentication control */
    service: 'auth',
    _unified: true
  },
  /* uses yaml config for single source */
  i18n: i18n,
  unified: require('./unified')
}
