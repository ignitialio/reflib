<template>
  <div class="services-layout">
    <v-list class="services-left-panel">
      <v-list-item v-for="(service, index) in services" :key="index"
        @click.stop="handleSelect(service)"
        @hook:mounted="handleMounted(service)"
        :class="{ 'selected': selected === service }">
        <v-list-item-avatar>
          <v-img :src="service._iconUrl" alt=""></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="service.name"></v-list-item-title>
          <v-list-item-subtitle
            v-text="service.options && service.options.description ?
              $t(service.options.description.title) : null"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <div class="services-right-panel">
      <component :is="selected.name"
        class="services-component elevation-2"
        v-if="selected && selected.options &&
          selected.options.uiComponentInjection"></component>

      <div>

      </div>
    </div>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy'
import values from 'lodash/values'

export default {
  data: () => {
    return {
      selected: null,
      services: null
    }
  },
  methods: {
    onServiceUp(service) {
      this.services = sortBy(values(this.$services.servicesDico), [ 'name' ])
      
      if (service.options && service.options.description) {
        this.getImage(service, service.name, service.options.description.icon)
          .then(() => {
            // console.log(service.name, service.options.description.icon, service._iconUrl)
            this.$forceUpdate()
          })
          .catch(err => console.log(err))
      } else {
        console.log('service [%s] up: no description', service.name)
      }
    },
    onServiceDown(service) {
      this.services = sortBy(values(this.$services.servicesDico), [ 'name' ])
      if (this.selected && service === this.selected.name) {
        this.selected = null
      }
    },
    handleMounted(item) {
      if (item.options && item.options.description) {
        this.getImage(item, item.name, item.options.description.icon)
          .then(() => {
            this.$forceUpdate()
          })
          .catch(err => console.log(err))
      } else {
        console.log('no description for service [%s]', item.name)
      }
    },
    getImage(itemToUpdate, serviceName, fileName) {
      return new Promise(async (resolve, reject) => {
        try {
          let imageData = await this.$services.getFileFromService(serviceName, fileName)
          let typedArray = new Uint8Array(imageData)
          let type = fileName.toLowerCase().match(/\.[0-9a-z]+$/i)[0].replace('.', '')
          if (type) {
            itemToUpdate._iconUrl = 'data:image/' + type + ';base64, ' +
              btoa(String.fromCharCode.apply(null, typedArray))
            this.$forceUpdate()
            resolve()
          }
        } catch (err) {
          reject(err)
        }
      })
    },
    handleSelect(service) {
      this.selected = service
    }
  },
  mounted() {
    // listeners
    this._listeners = {
      onServiceUp: this.onServiceUp.bind(this),
      onServiceDown: this.onServiceDown.bind(this)
    }
    this.$services.on('service:up', this._listeners.onServiceUp)
    this.$services.on('service:down', this._listeners.onServiceDown)

    this.services = sortBy(values(this.$services.servicesDico), [ 'name' ])

    this.$services.waitForService('iiost').then(iiost => {
      iiost.oneGetServiceMethod({ toto: 'titi' }).then(result => {
        console.log(result)
      }).catch(err => console.log(err))

      iiost.onePostServiceMethod({ toto: 'titi' }).then(result => {
        console.log(result)
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))

    this.$db.collection('users').then(users => {
      users.dFind({ }).then(result => {
        console.log('users', result.length)
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  },
  beforeDestroy() {
    this.$services.off('service:up', this._listeners.onServiceUp)
    this.$services.off('service:down', this._listeners.onServiceDown)
  }
}
</script>

<style scoped>
.services-layout {
  width: 100%;
  height: calc(100% - 0px);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.services-left-panel {
  position: relative;
  width: 33%;
  height: calc(100% - 0px)!important;
  overflow-y: auto;
}

.services-right-panel {
  width: 67%;
  height: calc(100% - 0px);
  padding-left: 8px;
}

.services-component {
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
