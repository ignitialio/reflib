import io from 'socket.io-client'

import { getStore } from '../store'

export default {
  install:
    function (Vue) {
      class WSService extends Vue {
        constructor() {
          super()
          this.$store = getStore(Vue)

          this.uuid = Math.random().toString(36).slice(2)

          this.socket = io.connect()

          this.socket.on('connect', () => {
            this.$store.commit('connected', true)
          })

          this.socket.on('disconnect', () => {
            this.$store.commit('connected', false)
          })
        }

        resetLocalCredentials() {
          localStorage.removeItem('token')
          this.$store.commit('user', null)
          this.$store.commit('param', null)
        }
      }

      Vue.prototype.$ws = new WSService()
    }
}
