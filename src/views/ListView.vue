<template>
  <div class="list-layout" :key="collection">
    <div class="list-left-panel">
      <v-progress-linear v-if="loading"
        indeterminate class="list-progress-bar"></v-progress-linear>

      <v-list class="list">
        <v-list-item v-for="(item, index) in items" :key="index"
          @click.stop="handleSelect(item)"
          @dblclick.stop="handleSelect(item, 'dblclick')"
          :class="{ 'selected': selected === item }">
          <v-list-item-avatar>
            <v-img :src="item.icon ?
              $utils.fileUrl(item.icon) : computeIcon(item)" alt=""></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              v-text="computeTitle(item)">
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

    <div class="list-right-panel">
      <ig-form v-if="editMode && !!selected && !!schema"
        v-model="selected" name="user" :schema.sync="schema">
      </ig-form>

      <ig-json-viewer v-if="!editMode && selected" :data="selected"
        class="list-json-viewer"></ig-json-viewer>
    </div>
  </div>
</template>

<script>
import concat from 'lodash/concat'
import slice from 'lodash/slice'
import filter from 'lodash/filter'
import { loadSchema, jsonDocNormalize } from '../commons'
const jp = require('jsonpath')

export default {
  data: () => {
    return {
      selected: null,
      items: [],
      jsonHTML: null,
      loading: false,
      editMode: false,
      schema: null,
      collection: null
    }
  },
  watch: {
    // multiple uses for this component, so it needs to know that he has to
    // update collection, etc.
    $route(to, from) {
      this.update()
    }
  },
  methods: {
    handleScroll(event) {
      let element = event.target

      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        this.showNextElements()
      }
    },
    showNextElements() {
      this.loading = true
      this.items = concat(this.items,
        slice(this.itemsData, this.nextIndex, this.nextIndex + 100))
      this.nextIndex += 100
      setTimeout(() => { this.loading = false }, 500)
    },
    handleSelect(item, dblclick) {
      this.selected = item
      this.$store.commit('param', this.selected)

      if (dblclick) {
        if (this.backOnSelect) {
          this.$router.push({ path: this.backOnSelect })
        } else {
          this.$router.push({
            path: '/item',
            query: {
              collection: this.collection
            }
          })
        }
      }
    },
    handleFileLoaded(data) {
      try {
        data = JSON.parse(data)
        // process '$' case: schemas contain properties taht starts with '$'
        data = jsonDocNormalize(data)

        this.$db.collection(this.collection).then(items => {
          items.dPut(data).then(result => {
            this.update()
          }).catch(err => console.log(err))
        }).catch(err => console.log(err))
      } catch (err) {
        console.log(err)
      }
    },
    handleDelete(item) {
      if (item._id) {
        this.$db.collection(this.collection).then(items => {
          items.dDelete(item).then(result => {
            console.log('deleted', item._id)
            this.update()
          }).catch(err => console.log(err))
        }).catch(err => console.log(err))
      }
    },
    handleSearch(data) {
      this.update(data)
    },
    handleEditMode(val) {
      this.editMode = val
      console.log('edit mode', val)
    },
    handleAddItem() {
      let item = (this.$utils.generateDataFormJSONSchema(this.schema)).json

      this.$store.commit('param', item)

      this.$router.push({
        path: '/item',
        query: {
          collection: this.collection
        }
      })
    },
    update(queryFilter) {
      this.collection = this.$router.currentRoute.query.collection
      console.log('ROUTE', this.$router.currentRoute.path, 'LIST', this.collection)

      this.backOnSelect = this.$router.currentRoute.query.backOnSelect

      if (this.collection) {
        loadSchema(this, this.collection).then(schema => {
          this.schema = schema
        }).catch(err => {
          this.$services.emit('view:list:editable', false)
          console.log(err)
        })

        this.items = []
        this.$db.collection(this.collection).then(items => {
          items.dFind({}).then(docs => {
            this.itemsData = docs
            this.nextIndex = 0

            if (queryFilter) {
              this.itemsData = filter(this.itemsData, e => {
                return !!JSON.stringify(e).match(queryFilter)
              })
            }

            this.showNextElements()
          }).catch(err => console.log(err))
        }).catch(err => console.log(err))
      }
    },
    computeIcon(item) {
      if (this.schema && this.schema._meta && this.schema._meta.list && this.schema._meta.list.icon) {
        return this.$utils.fileUrl(jp.query(item, this.schema._meta.list.icon)[0])
      } else {
        return 'assets/item.png'
      }
    },
    computeTitle(item) {
      if (this.schema && this.schema._meta && this.schema._meta.list && this.schema._meta.list.title) {
        let refs = this.schema._meta.list.title.split('+')
        let result = ''
        for (let r of refs) {
          result += jp.query(item, r) + ' '
        }
        return result
      } else {
        return item.name || item.title || item.description
      }
    }
  },
  mounted() {
    // show contextual menu bar
    this.$services.emit('app:context:bar', 'list-ctx')

    this._listeners = {
      onEditMode: this.handleEditMode.bind(this),
      onFileLoaded: this.handleFileLoaded.bind(this),
      onSearch: this.handleSearch.bind(this),
      onAddItem: this.handleAddItem.bind(this)
    }

    let listEl = this.$el.getElementsByClassName('list')[0]
    listEl.addEventListener('scroll', this.handleScroll.bind(this))

    this.update()

    this.$services.on('view:list:loaded', this._listeners.onFileLoaded)
    this.$services.on('view:list:search', this._listeners.onSearch)
    this.$services.on('view:list:edit', this._listeners.onEditMode)
    this.$services.on('view:list:add', this._listeners.onAddItem)

    this.$services.once('view:list:ready', () => {
      this.$services.emit('view:list:collection', this.collection)
    })
  },
  beforeDestroy() {
    this.$services.emit('app:context:bar', null)

    this.$services.off('view:list:loaded', this._listeners.onFileLoaded)
    this.$services.off('view:list:search', this._listeners.onSearch)
    this.$services.off('view:list:edit', this._listeners.onEditMode)
    this.$services.off('view:list:add', this._listeners.onAddItem)
  }
}
</script>

<style>
.list-layout {
  display: flex;
  width: 100%;
  height: calc(100% - 0px);
}

.list-left-panel {
  width: 33%;
}

.list-progress-bar {
  position: absolute;
  width: 100%;
}

.list-right-panel {
  flex: 1;
  height: calc(100% - 0px);
  padding-left: 8px;
  overflow-y: auto;
}

.list-json-viewer {
  width: 100%;
}

</style>
