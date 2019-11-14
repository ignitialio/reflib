<template>
  <div class="ig-icon-switch-layout"
    :class="{ 'small' : size === 'small',
      'medium' : size === 'medium',
      'large' : size === 'large',
      'icon': type && !value,
      'active': value }"
    @click="handleClick">

    <v-icon v-if="type">{{ type }}</v-icon>
  </div>
</template>

<script>
export default {
  name: 'ig-iconswitch',
  props: {
    type: String,
    value: {
      type: Boolean
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style scoped>
.ig-icon-switch-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 12px;
  cursor: pointer;
  user-select: none;
  border: 1px solid gainsboro;
  border-radius: 4px;
}

.ig-icon-switch-layout * {
  color: dimgray;
}

.ig-icon-switch-layout.small {
  width: 32px;
  height: 32px;
}

.ig-icon-switch-layout.medium {
  width: 48px;
  height: 48px;
}

.ig-icon-switch-layout.large {
  width: 64px;
  height: 64px;
}

.ig-icon-switch-layout:hover {
  border: 1px solid dodgerblue;
}

.ig-icon-switch-layout.icon:hover * {
  color: dodgerblue;
}

.ig-icon-switch-layout.icon:active * {
  color: deepskyblue;
}

.ig-icon-switch-layout.active * {
  color: dodgerblue;
}

.ig-icon-switch-layout.active {
  border: 1px solid dodgerblue;
}

@media screen and (max-width: 800px) {

}
</style>
