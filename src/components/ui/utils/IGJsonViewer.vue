<template>
  <div class="json-viewer-layout">

  </div>
</template>

<script>
import * as d3 from 'd3'
import jsonPretty from 'json-pretty-html'

export default {
  name: 'ig-jsonviewer',
  props: [ 'data' ],
  watch: {
    data: function(val) {
      d3.select(this.$el).html(jsonPretty(val))
      console.log(val)
    }
  },
  mounted() {
    d3.select(this.$el).html(jsonPretty(this.data))
  }
}
</script>

<style>
.json-viewer-layout {
  height: calc(100% - 0px);
  font-family: Menlo, Monaco, "Courier New", monospace;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0;
  text-align: left;
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0;
  overflow-y: auto;
}

.json-viewer-layout .json-key {
  color: dodgerblue;
  font-weight: bold;
}

.json-viewer-layout .json-pretty {
    padding-left: 30px;
    padding-right: 30px;
}

.json-viewer-layout .json-selected {
  background-color: rgba(139, 191, 228, 0.19999999999999996);
}

.json-viewer-layout .json-string {
  color: #6caedd;
}

.json-viewer-layout .json-key {
  color: #ec5f67;
}

.json-viewer-layout .json-boolean {
    color: #99c794;
}

.json-viewer-layout .json-number {
    color: #99c794;
}

@media screen and (max-width: 800px) {

}
</style>
