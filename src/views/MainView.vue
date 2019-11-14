<template>
  <div class="main-layout">
    <div class="main-item elevation-2"
      :style="'background-image: url(data:image/png;base64,' + item.icon + ')'"
      v-for="item in deployables" :key="item.name">
      <div class="main-item--title">{{ item.name }}</div>
      <div class="main-item--description">{{ item.description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deployables: []
    }
  },
  watch: {},
  components: {
  },
  computed: {},
  methods: {
    update() {
      this.$db.collection('deployables').then(deployables => {
        deployables.dFind({}).then(docs => {
          this.deployables = docs
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }
  },
  mounted() {
    this.update()
    // d3.json('data/schemas/deployables.schema.json').then(result => {
    //   let json = this.$utils.generateDataFormJSONSchema(result).json
    //   console.log($j(json))
    // })
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

.main-item {
  margin: 4px;
  width: 200px;
  height: 200px;
  padding: 16px;
  background-position: center;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.main-item--title {
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.main-item--description {
  width: 100%;
  text-align: center;
  font-size: 0.7em;
}
</style>
