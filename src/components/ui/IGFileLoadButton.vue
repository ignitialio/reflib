<template>
  <div class="fileloadbut-layout">
    <label :for="uid" class="fileloadbut-label">
      <v-icon :color="color">{{ icon }}</v-icon>
    </label>
    <input :id="uid" style="display: none" :disabled="disabled" type="file"
      :accept="accept"
      @change="handleLoad"/>
  </div>
</template>

<script>
export default {
  name: 'ig-fileload-but',
  props: {
    icon: {
      type: String,
      default: 'vertical_align_top'
    },
    color: {
      type: String,
      default: 'blue lighten-1'
    },
    disabled: Boolean,
    accept: String,
    maxSize: {
      type: Number,
      default: 50000
    },
    value: Object
  },
  data: () => {
    return {
      uid: 'file-upload-' + Math.random().toString(36).slice(12)
    }
  },
  methods: {
    handleLoad(event) {
      let file = event.target.files[0]
      if (file.size <= this.maxSize) {
        this.$emit('input', file)
      } else {
        this.$emit('error', 'File too big')
      }
    }
  }
}
</script>

<style scoped>
.fileloadbut-layout {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.fileloadbut-label {
  cursor: pointer;
}

.fileloadbut-layout:hover {
  background: rgba(93, 93, 93, 0.1)!important;
}

@media screen and (max-width: 800px) {

}
</style>
