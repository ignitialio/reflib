export default {
  install:
    function (Vue) {
      Vue.prototype.$db = {
        collection: function(name) {
          return Vue.prototype.$services
            .waitForService(Vue.prototype.$config.data.service + ':' + name)
        }
      }
    }
}
