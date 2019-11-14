const passport = require('passport')
const LocalStrategy = require('passport-local')

const appserver = require('@ignitial/iio-app-server')
const IIOAppServer = appserver.IIOAppServer
const defaultModules = appserver.defaultModules
const defaultUnified = appserver.defaultUnified

const MyUnified = require('./services/myunified.service')
const MyAddOn = require('./modules/myaddon.module')

const config = require('./config')

let app = new IIOAppServer(config)

app.on('client', clientId => {
  for (let unifiedName in defaultUnified) {
    app.ws.addService(unifiedName, defaultUnified[unifiedName],
      config.unified.options[unifiedName], clientId)
  }

  // Example: declaring additional unified service
  app.ws.addService('myunified', MyUnified, config.unified.options.myunified, clientId)
})

for (let moduleName in defaultModules) {
  app.instantiateModule(moduleName, defaultModules[moduleName])
}

// Example: declaring additional module
app.instantiateModule('myaddon', MyAddOn)

// Example: declaring additional HTTP endpoints: uses Connect-Rest
app._rest.get('/myfancyroute', async (request, content) => {
  let answer = {
    message: 'what a wonderful world !'
  }

  return answer
})

passport.use(new LocalStrategy(
  function(username, password, done) {
  }
))

app._rest.post('/login', async (request, content) => {
  try {
    let gateway = await app._waitForModule('gateway')
    let auth = await gateway.gateway._waitForServiceAPI(app._config.auth.service)
    let token =
      await auth.signin(request.body.username, request.body.password)

    return token
  } catch(err) {
    app.logger.error(err, 'failed to login by HTTP')
    return { err: 'failed to login: ' + err }
  }
})

app._rest.post('/publish', async (request, content) => {
  try {
    let gateway = await app._waitForModule('gateway')
    let auth = await gateway.gateway._waitForServiceAPI(app._config.auth.service)
    let userId = await auth.authorize(request.body.token)
    let deployables =
      await gateway.gateway._waitForServiceAPI(app._config.data.service + ':deployables')

    await deployables.dPut(request.body.record, {
      $privileged: false,
      $userId: userId
    })
  } catch (err) {
    app.logger.error(err, 'failed to publish')
    return { err: 'failed to publish: ' + err }
  }

  // console.log(request.parameters, request.body, request.query)

  return 'ok'
})
