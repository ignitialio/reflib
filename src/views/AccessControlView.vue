<template>
  <div class="main-layout">
    <ig-json-viewer :data="rag"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rag: null
    }
  },
  watch: {},
  components: {},
  computed: {},
  methods: {},
  mounted() {
    this.$services.waitForService(this.$config.data.service).then(data => {
      data.getRolesAndGrants().then(rag => {
        this.rag = rag
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  },
  beforeDestroy() {

  }
}
</script>

<style>
.main-layout {
  width: 100%;
  height: calc(100% - 0px);
}

.main-ex {
  width: 100%;
  height: calc(100% - 0px);
}
</style>
