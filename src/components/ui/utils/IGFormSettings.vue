<template>
  <v-dialog class="formsettings-layout" :value="value"
    fullscreen hide-overlay transition="dialog-bottom-transition">

    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="handleCloseSettings">
          <v-icon>close</v-icon>
        </v-btn>

        <v-toolbar-title>{{ $t('Property detailed type') }} [ {{ name }} ]</v-toolbar-title>

        <div class="flex-grow-1"></div>
        <v-toolbar-items>
          <v-btn icon text @click="handleCloseSettings">
            <v-icon color="white">check</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <div v-if="schema" class="formsettings-main">
        <div class="formsettings-left">
          <v-select v-if="schema.type === 'string' && schema._meta" :label="$t('Type')"
            :items="strTypes" v-model="schema._meta.type"></v-select>

          <v-select v-else-if="!isPrimitive && schema._meta" :label="$t('Type')"
            :items="objTypes" v-model="schema._meta.type"></v-select>

          <!-- string pattern -->
          <v-text-field v-else :label="$t('Pattern')" v-model="schema._meta.pattern">
          </v-text-field>
        </div>

        <div class="formsettings-right">
          <div class="formsettings-enums"
            v-if="schema._meta.type === 'enum'">
            <div class="formsettings-enums-item"
              v-for="(item, index) in schema.enum" :key="index">
              <v-btn v-if="index === schema.enum.length - 1" icon
                @click.stop="handleAddEnumItem">
                <v-icon color="green darken-1">add</v-icon>
              </v-btn>

              <div v-else style="width: 32px; height: 32px;"></div>

              <v-text-field style="width: 30%; margin: 0 16px;" class="tw-w-2/6"
                v-model="item.value" :label="$t('Value')"></v-text-field>

              <v-text-field v-model="item.text" :label="$t('Text')"></v-text-field>

              <v-btn icon @click="handleRemoveEnumItem">
                <v-icon color="red darken-1">clear</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Item is File -->
          <div class="formsettings-enums-file"
            v-else-if="schema._meta.type === 'file'">
            <v-text-field v-model="schema._meta.maxSize" type="number"
              :label="$t('Max size')"></v-text-field>

            <v-text-field v-model="schema._meta.fileType"
              :label="$t('File type')"></v-text-field>
          </div>

          <!-- Item is Image -->
          <div class="formsettings-enums-file"
            v-else-if="schema._meta.type === 'image'">
            <v-text-field v-model="schema._meta.maxSize" type="number"
              :label="$t('Max size')"></v-text-field>

            <v-select :items="imageTypes" v-model="schema._meta.imageType"
              :label="$t('Image type')"></v-select>

            <v-checkbox :label="$t('Show thumbnail')"
              v-model="schema._meta.showThumbnail"></v-checkbox>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ig-form-settings',
  props: {
    name: {
      type: String
    },
    value: {
      type: Boolean
    },
    schema: {}
  },
  data: () => {
    return {
      strTypes: [
        {
          value: 'enum',
          text: 'Enum'
        },
        {
          value: 'file',
          text: 'File'
        },
        {
          value: 'image',
          text: 'Image'
        },
        {
          value: 'date',
          text: 'Date format'
        },
        {
          value: 'time',
          text: 'Time format'
        },
        {
          value: 'datetime',
          text: 'Date and time format'
        },
        {
          value: null,
          text: ''
        }
      ],
      imageTypes: [
        {
          value: 'image/jpeg',
          text: 'JPEG'
        },
        {
          value: 'image/png',
          text: 'PNG'
        },
        {
          value: 'image/webp',
          text: 'WebP'
        },
        {
          value: 'image/svg+xml',
          text: 'SVG'
        },
        {
          value: 'image/*',
          text: 'All'
        }
      ],
      objTypes: [
        {
          value: 'geopoint',
          text: 'Geographical location'
        },
        {
          value: 'geoshape',
          text: 'Geographical shape'
        },
        {
          value: null,
          text: ''
        }
      ]
    }
  },
  methods: {
    handleAddEnumItem() {
      this._schema.enum.push({
        text: '',
        value: null
      })

      this.$emit('update:schema', this._schema)
      this.$forceUpdate()
    },
    handleRemoveEnumItem(item) {
      let index = this._schema.enum.indexOf(item)
      this._schema.enum.splice(index, 1)

      this.$emit('update:schema', this._schema)
    },
    handleCloseSettings() {
      this.$emit('input', false)
    }
  },
  computed: {
    isPrimitive() {
      if (this.schema.type === 'object' || this.schema.type === 'array') {
        return false
      }

      return true
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.formsettings-layout {

}

.formsettings-main {
  height: calc(100% - 0px);
  display: flex;
  padding: 16px;
}

.formsettings-left {
  width: 33%;
  height: calc(100% - 0px);
  overflow-y: auto;
  border-right: 1px solid gainsboro;
  padding: 0 8px;
}

.formsettings-right {
  width: 67%;
  height: calc(100% - 0px);
  overflow-y: auto;
  padding: 4px
}

.formsettings-enum {
  display: flex;
  flex-flow: column;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0 4px;
}

.formsettings-enums-item {
  display: flex;
  align-items: center;
}

.formsettings-enums-file {
  display: flex;
  flex-flow: column;
}

.formsettings-actions {
  height: 64px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

@media screen and (max-width: 800px) {

}
</style>
