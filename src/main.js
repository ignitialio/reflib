import './registerServiceWorker'

import Vue from 'vue'
import vuetify from '@/plugins/vuetify.plugin'

import { sync } from 'vuex-router-sync'

import './main.css'
import 'typeface-roboto'
import 'material-design-icons/iconfont/material-icons.css'
import 'vuetify/dist/vuetify.min.css'

import * as d3 from 'd3'

import App from './components/App.vue'
import { getRouter } from './router'
import { getStore } from './store'

// Vue plugins
import wsPlugin from './plugins/ws.plugin'
import servicesPlugin from './plugins/services.plugin'
import modulesPlugin from './plugins/modules.plugin'
import i18nPlugin from './plugins/i18n.plugin'
import configPlugin from './plugins/config.plugin'
import utilsPlugin from './plugins/utils.plugin'
import uiPlugin from './plugins/ui.plugin'
import dbPlugin from './plugins/db.plugin'

// -----------------------------------------------------------------------------
// Specific imports

import storeModule from './store/store.module'

// -----------------------------------------------------------------------------

// Vue configuration
Vue.config.productionTip = false

// get instances
let router = getRouter(Vue)
let store = getStore(Vue)

// -----------------------------------------------------------------------------
// Specific store
store.registerModule('reflib', storeModule)
// -----------------------------------------------------------------------------

// router sync
sync(store, router)

// Vue plugins use
Vue.use(utilsPlugin)
Vue.use(wsPlugin)
Vue.use(servicesPlugin)
Vue.use(modulesPlugin)
Vue.use(i18nPlugin)
Vue.use(configPlugin)
Vue.use(uiPlugin)
Vue.use(dbPlugin)

// initialize components
// ...

// waiting for asyncrounous plugins to be ready (here i18n)
Vue.prototype.$utils
  .waitForProperties(Vue.prototype, [ '$i18n', '$config' ]).then(async () => {
    // create app
    const app = new Vue({
      vuetify,
      router,
      store,
      ...App
    })

    app.$services.waitForService(app.$config.auth.service).then(async authService => {
      try {
        if (localStorage.getItem('token')) {
          let user = await authService.authenticate(localStorage.getItem('token'))
          // console.log('authenticated', user)
          app.$store.commit('user', user)
        } else {
          app.$ws.resetLocalCredentials()
          app.$store.commit('user', null)
          /* NOT AN APP
          if (app.$router.currentRoute.path !== '/login') {
            app.$router.push('/login')
          }
          */
        }
      } catch (err) {
        console.log('failed to authenticate', err)
        app.$ws.resetLocalCredentials()
        app.$store.commit('user', null)
        /* NOT AN APP
        setTimeout(() => {
          if (app.$router.currentRoute.path !== '/login') {
            app.$router.push('/login')
          }
        }, 100)
        */
      }
    })

    // manage splashscreen/progress
    d3.select('#splashscreen').style('opacity', 0)
    d3.select('#progress').style('opacity', 0)

    setTimeout(() => {
      d3.select('#splashscreen').remove()
      d3.select('#progress').remove()
    }, 1000)

    app.$mount('#app')
  }).catch(err => console.log(err))
