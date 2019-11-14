<template>
  <v-dialog class="schemamgt-layout" :value="value"
    fullscreen hide-overlay transition="dialog-bottom-transition">

    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="handleCloseSettings">
          <v-icon>close</v-icon>
        </v-btn>

        <v-toolbar-title>{{ $t('Loading schema for collection ') }} [ {{ collection }} ]</v-toolbar-title>

        <div class="flex-grow-1"></div>
        <v-toolbar-items>
          <ig-fileinput button loadToBrowser color="white"
            :title="$t('Load item')" @load="handleItemLoad"/>

          <v-btn icon text @click="handleCloseSettings">
            <v-icon color="white">check</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <div class="schemamgt-main">
        <div class="schemamgt-left">
          <v-list class="schemamgt-list">
            <v-list-item v-for="(item, index) in items" :key="index"
              class="schemamgt-item"
              @click.stop="handleSelect(item)"
              :class="{ 'selected': selected === item }">

              <v-list-item-content>
                <v-list-item-title v-text="item.title">
                </v-list-item-title>
                <v-list-item-subtitle v-text="item._id + ''"></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click.stop="handleDelete(item)">
                  <v-icon color='red darken-1'>clear</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>

        <div class="schemamgt-right">
          <ig-json-viewer :data="selected" class="schemamgt-json-viewer"></ig-json-viewer>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ig-schema-manager',
  props: {
    value: Boolean,
    collection: String
  },
  data: () => {
    return {
      items: [],
      selected: null
    }
  },
  methods: {
    update() {
      if (this.collection) {
        this.$db.collection('schemas').then(schemas => {
          schemas.dFind({}).then(docs => {
            this.items = docs
          }).catch(err => console.log(err))
        }).catch(err => console.log(err))
      }
    },
    handleSelect(item) {
      this.selected = item
    },
    handleCloseSettings() {
      this.$emit('input', false)
    },
    handleDelete(item) {
      if (item._id) {
        this.$db.collection('schemas').then(schemas => {
          schemas.dDelete(item).then(result => {
            console.log('deleted', item._id)
            this.update()
            this.selected = null
          }).catch(err => console.log(err))
        }).catch(err => console.log(err))
      }
    },
    handleItemLoad(data) {
      try {
        data = JSON.parse(data)
        data._schema = data.$schema
        delete data.$schema

        this.$db.collection('schemas').then(schemas => {
          schemas.dPut(data).then(result => {
            console.log('item loaded', result)
            this.update()
          }).catch(err => console.log(err))
        }).catch(err => console.log(err))
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.update()
  }
}
</script>

<style scoped>
.schemamgt-layout {

}

.schemamgt-main {
  height: calc(100% - 0px);
  display: flex;
  padding: 16px;
}

.schemamgt-left {
  width: 33%;
  height: calc(100% - 0px);
  overflow-y: auto;
  border-right: 1px solid gainsboro;
  padding: 0 8px;
  position: relative;
}

.schemamgt-right {
  width: 67%;
  height: calc(100vh - 96px);
  overflow-y: auto;
}

.schemamgt-json-viewer {
  width: 100%;
}

.schemamgt-progress-bar {
  position: absolute;
  width: 100%;
}

.schemamgt-item.selected {
  background-color: dodgerblue;
  color: white!important;
}

.schemamgt-item.selected:hover {
  background-color: deepskyblue;
}

@media screen and (max-width: 800px) {

}
</style>
