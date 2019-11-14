<template>
  <div class="fileinput-layout"
    :class="{
      'readonly': readonly && !disabled && !button,
      'hover': !readonly && !disabled && !button
    }">

    <v-btn icon class="fileinput-trigger" :disabled="disabled">
      <v-icon :color="color">vertical_align_top</v-icon>
    </v-btn>

    <div v-if="!button" class="fileinput-drop-target">
      <label v-if="label"
        class="fileinput-label"
        :class="{ 'disabled': disabled }">
        {{ label }} {{ showThumbnail }}</label>

      <input readonly :disabled="disabled"
        :class="{
          'disabled': disabled,
          'readonly': readonly
        }"
        :value="value"
        type="text"/>
    </div>

    <v-img v-if="showThumbnail && !button" :src="value"
      max-height="32" max-width="32" aspect-ratio="1"
      class="fileinput-thumbnail"></v-img>
  </div>
</template>

<script>
import * as d3 from 'd3'
import Flow from '@flowjs/flow.js'

import ss from 'socket.io-stream'

export default {
  name: 'ig-fileinput',
  props: {
    value: {},
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String
    },
    readonly: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    showThumbnail: {
      type: Boolean
    },
    button: {
      type: Boolean
    },
    s3: {
      type: Boolean
    },
    loadToBrowser: {
      type: Boolean
    },
    color: {
      type: String,
      default: 'blue darken-1'
    }
  },
  methods: {
    handleFileSelection(event) {
      console.log(event)
      this.$emit('input', event.target.value)
    },
    streamFile(file) {
      let stream = ss.createStream()

      // upload a file to the server.
      ss(this.$ws.socket).emit('ws:file:upload', stream, {
        name: file.name,
        size: file.size,
        bucket: this.$utils.bucket.name,
        userId: this.$store.state.user._id
      })

      let blobStream = ss.createBlobReadStream(file)

      let size = 0

      blobStream.on('data', chunk => {
        size += chunk.length
        file.progress = parseInt(size / file.size * 100)
        this.$forceUpdate()

        let loaded = []
        for (let f of this.filesToUpload) {
          if (f.progress === 100) {
            loaded.push(f)
          }
        }
        this.$emit('input', loaded)
      })

      blobStream.pipe(stream)
    }
  },
  mounted() {
    var flow = new Flow({
      target: '/api/upload',
      query: {
        token: localStorage.getItem('token')
      }
    })

    if (!flow.support) {
      console.log('Flow not supported !')
    }

    flow.assignBrowse(d3.select(this.$el).select('.fileinput-trigger').node())
    if (!this.button) {
      flow.assignDrop(d3.select(this.$el).select('.fileinput-drop-target').node())
    }

    flow.on('fileAdded', (file, event) => {
      console.log(file, event)
      this.$emit('input', file.name)
    })

    flow.on('fileSuccess', (file, message) => {
      this.$services.emit('app:notification',
        this.$t('`File ${ params[0] } uploaded`', file.name))

      if (this.button) {
        flow.cancel()
        this.$services.emit('app:progress:show', false)
      }
    })

    flow.on('filesSubmitted', files => {
      if (this.button) {
        this.$services.emit('app:progress:show', true)
      }

      if (!this.loadToBrowser && !this.s3) {
        flow.upload()
      } else if (this.loadToBrowser) {
        for (let file of files) {
          let reader = new FileReader()

          reader.onload = evt => {
            this.$emit('load', evt.target.result)

            this.$services.emit('app:progress:show', false)
          }

          // is Flow file, so get file attribute
          reader.readAsText(file.file)
        }
      } else if (this.s3) {

      }
    })

    flow.on('fileProgress', file => {
      this.$services.emit('app:progress', file.progress() * 100)
    })

    flow.on('fileError', (file, message) => {
      console.log('FLOW FILE ERROR', file, message)
    })

    flow.on('error', (file, message) => {
      console.log('FLOW ERROR', file, message)
    })
  },
  computed: {
  }
}
</script>

<style scoped>
.fileinput-layout {
  margin: 4px;
  display: flex;
}

.fileinput-layout.readonly {
  background-color: rgba(100, 100, 100, 0.5);
}

.fileinput-layout.readonly:hover {
  background-color: rgba(100, 100, 100, 0.5);
}

.fileinput-label {
  top: 0;
  left: 0;
  font-size: 8px;
  user-select: none;
}

.fileinput-drop-target {
  display: flex;
  flex-flow: column;
  flex: 1;
}

.fileinput-drop-target input {
  outline: none;
  height: 24px;
  background: transparent;
  color: dimgray;
  border-bottom: 1px solid dodgerblue;
}

.fileinput-drop-target.disabled input {
  border-bottom: 1px solid dodgerblue;
}

.fileinput-label.disabled {
  color: gainsboro;
  border-bottom: 1px solid dodgerblue;
}

.fileinput-thumbnail {
  margin-left: 4px;
}

@media screen and (max-width: 800px) {

}
</style>
