import Router from 'vue-router'

var routerInstance

export function getRouter(Vue) {
  if (routerInstance) return routerInstance
  Vue.use(Router)

  routerInstance = new Router({
    mode: 'hash',
    routes: []
  })

  return routerInstance
}
