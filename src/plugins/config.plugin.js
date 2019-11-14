export default {
  install:
    function (Vue) {
      Vue.prototype.$services.waitForService('config')
        .then(async configService => {
          let cfg = await configService.get()
          Vue.prototype.$config = cfg
        }).catch(err => console.log(err))
    }
}
