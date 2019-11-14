<template>
  <div class="listctx-layout">
    <v-icon color="grey">search</v-icon>
    <input
      class="listctx-search"
      :placeholder="$t('Search')" @change="handleSearch"/>

    <div style="flex: 1"></div>

    <!-- <div class="listctx-title">{{ collection }}</div>-->

    <div class="listctx-divider"></div>

    <ig-iconswitch v-if="editable" v-model="editMode" size="small" type="edit"
      :title="$t('Document edit')"></ig-iconswitch>

    <div v-if="editable" class="listctx-divider"></div>

    <v-btn icon :title="$t('Add item')" @click="handleItemAdd">
      <v-icon color="blue darken-1">add</v-icon>
    </v-btn>

    <ig-fileinput button loadToBrowser :title="$t('Load item')" @load="handleItemLoad"/>

    <div class="listctx-divider"></div>
  </div>
</template>

<script>
export default {
  name: 'ig-listctx',
  data: () => {
    return {
      editMode: false,
      collection: '',
      editable: true
    }
  },
  watch: {
    editMode: function(val) {
      this.$services.emit('view:list:edit', val)
    }
  },
  methods: {
    handleItemAdd() {
      this.$services.emit('view:list:add')
    },
    handleItemLoad(data) {
      this.$services.emit('view:list:loaded', data)
    },
    handleSearch(event) {
      this.$services.emit('view:list:search', event.target.value)
    },
    handleCollection(collection) {
      this.collection = collection
    },
    handleEditable(val) {
      this.editable = val
    }
  },
  mounted() {
    this._listeners = {
      onCollection: this.handleCollection.bind(this),
      onEditable: this.handleEditable.bind(this)
    }

    this.$services.on('view:list:collection', this._listeners.onCollection)
    this.$services.on('view:list:editable', this._listeners.onEditable)

    this.$services.emit('view:list:ready')
  },
  beforeDestroy() {
    this.$services.off('view:list:collection', this._listeners.onCollection)
    this.$services.off('view:list:editable', this._listeners.onEditable)
  }
}
</script>

<style scoped>
.listctx-layout {
  width: 100%;
  height: calc(100% - 0px);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.listctx-search {
  outline: none;
  color: dimgray;
  border-bottom: 1px solid gainsboro;
}

.listctx-search:focus {
  border-bottom: 1px solid dodgerblue;
}

.listctx-divider {
  height: 32px;
  border-left: 1px solid gainsboro;
}

.listctx-title {
  margin-right: 16px;
}

.theme--light .listctx-title {
  color: dimgray;
}

.theme--dark .listctx-title {
  color: dimgray;
}

@media screen and (max-width: 800px) {

}
</style>
