import { I18n } from '@ignitial/iio-app-client'

export default {
  install:
    function (Vue) {
      Vue.prototype.$services.waitForService('config')
        .then(async configService => {
          let cfg = await configService.get()
          let i18n = new I18n()
          i18n.initialize(cfg)
          Vue.prototype.$services.$i18n = i18n
          Vue.prototype.$i18n = i18n
          Vue.prototype.$t = i18n.t.bind(i18n)
        }).catch(err => console.log(err))
    }
}
