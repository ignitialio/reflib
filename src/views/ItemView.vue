<template>
  <div class="item-layout">
    <ig-form v-if="schema" class="item-form"
      v-model="item" :schema.sync="schema"
      :editable="$store.state.user.role === 'admin' && editMode">
    </ig-form>

    <!-- Schema settings dialog -->
    <ig-schema-manager ref="settings" v-model="schemaDialog"
      :collection="collection"></ig-schema-manager>
  </div>
</template>

<script>
import { loadSchema } from '../commons'

export default {
  data: () => {
    return {
      editMode: null,
      item: null,
      collection: null,
      schema: null,
      itemModified: false,
      schemaDialog: false
    }
  },
  watch: {
    item: {
      handler: function(val) {
        this.itemModified = true
        this.$services.emit('view:item:modified', true)
      },
      deep: true
    }
  },
  methods: {
    update() {
      if (this.collection) {
        this.$db.collection(this.collection).then(items => {
          items.dFind(this.item).then(result => {
            console.log(result)
          }).catch(err => console.log(err))
        }).catch(err => console.log(err))
      }
    },
    handleEditMode(val) {
      this.editMode = val
    },
    handleSaveItem() {
      this.$db.collection(this.collection).then(async items => {
        try {
          let result
          // console.log(this.item._id, typeof this.item._id)
          if (this.item._id) {
            result = await items.dUpdate({ _id: this.item._id }, this.item)
            // console.log('updated item', this.item._id)
          } else {
            result = await items.dPut(this.item)
            this.item._id = result._id
          }

          this.itemModified = false
          this.$services.emit('view:item:modified', false)
          this.$services.emit('app:notification', this.$t('Modification done'))
        } catch (err) {
          this.$services.emit('app:notification', this.$t('Modification failed'))
        }
      }).catch(err => console.log(err))
    },
    handleLoadSchema() {
      this.schemaDialog = true
    }
  },
  async mounted() {
    this._listeners = {
      onEditMode: this.handleEditMode.bind(this),
      onItemSave: this.handleSaveItem.bind(this),
      onLoadSchema: this.handleLoadSchema.bind(this)
    }

    this.collection = this.$router.currentRoute.query.collection
    this.item = this.$store.state.param
    console.log(this.item._id, typeof this.item._id)
    this.schema = await loadSchema(this, this.collection)

    this.$services.emit('app:context:bar', 'item-ctx')

    this.$services.on('view:item:edit', this._listeners.onEditMode)
    this.$services.on('view:item:save', this._listeners.onItemSave)
    this.$services.on('view:schema:load', this._listeners.onLoadSchema)
  },
  beforeDestroy() {
    this.$services.emit('app:context:bar', null)

    this.$services.off('view:item:edit', this._listeners.onEditMode)
    this.$services.off('view:item:save', this._listeners.onItemSave)
    this.$services.off('view:schema:load', this._listeners.onLoadSchema)
  }
}
</script>

<style>
.item-layout {
  width: 100%;
  height: calc(100% - 32px);
  overflow-y: auto;
}

.item-form {
  width: 66%;
  margin: 0px 15%;
}
</style>
