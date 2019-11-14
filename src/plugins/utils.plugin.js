import { Utils } from '@ignitial/iio-app-client'

export default {
  install:
    function (Vue) {
      Vue.prototype.$utils = Utils

      global.$j = obj => JSON.stringify(obj, null, 2)
    }
}
