import { Services } from '@ignitial/iio-app-client'

export default {
  install:
    function (Vue) {
      let services = new Services(Vue.prototype.$ws.socket, 'bson')
      services.initialize(Vue)
      Vue.prototype.$services = services
    }
}
