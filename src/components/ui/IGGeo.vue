<template>
  <div class="geo-layout"
    :style="height ? 'height: ' + (height + 48) + 'px' : 'auto'">
    <vl-map ref="map" class="geo-map"
      :load-tiles-while-animating="true" :load-tiles-while-interacting="true"
      data-projection="EPSG:4326" :style="'height: ' + height + 'px'"
      @click="handleMapClick">
      <vl-view v-if="mapCenter" ref="olview"
        :zoom="zoom" :center.sync="mapCenter" :rotation="rotation"></vl-view>

      <vl-feature v-if="geoloc.position" id="position-feature">
        <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
        <vl-style-box>
          <vl-style-icon src="assets/markers/marker.png"
            :scale="0.4" :anchor="[0.5, 1]"></vl-style-icon>
        </vl-style-box>
      </vl-feature>

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>

    <div class="geo-actions">
      <v-btn icon class="geo-centering"
        @click.stop="handleUpdateCenter">
        <v-icon>gps_fixed</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import ResizeSensor from 'resize-sensor'

import Vue from 'vue'
import VueLayers from 'vuelayers'

import 'vuelayers/lib/style.css' // needs css-loader

Vue.use(VueLayers, {
  dataProjection: 'EPSG:4326'
})

export default {
  name: 'ig-geo',
  props: {
    marker: {},
    zoom: {
      type: Number,
      default: 8
    },
    rotation: {
      type: Number,
      default: 0
    },
    center: {
      type: Array,
      default: function() {
        return [ 9.689404, 39.987910 ]
      }
    },
    height: {
      type: Number
    }
  },
  watch: {
    marker: function(val) {
      this.handleMarker(val)
    },
    mapCenter: function(val) {
      this.$emit('update:center', val)
    },
    geoloc: function(val) {
      console.log('MARKER', global.$j(val))
    },
    height: function() {
      this.$refs.map.updateSize()
    }
  },
  data() {
    return {
      geoloc: { position: null },
      mapCenter: null
    }
  },
  methods: {
    handleMarker(val) {
      if (val) {
        if (Array.isArray(val)) {
          this.geoloc.position = val
        } else {
          this.geoloc.position =
            [ parseFloat(val.longitude), parseFloat(val.latitude) ]
        }

        if (!this.mapCenter) {
          this.mapCenter = this.geoloc.position

          console.log('MAP CENTER UPDATE', global.$j(this.mapCenter))
        }
      }
    },
    handleMapClick(e) {
      this.$emit('update:marker', e.coordinate)
    },
    handleUpdateCenter() {
      if (this.geoloc.position) {
        this.$refs.olview.animate({
          center: this.geoloc.position,
          duration: 2000
        })
      }
    }
  },
  mounted() {
    this.resizeSensor = new ResizeSensor(this.$el, () => {
      this.$refs.map.updateSize()
    })

    this.handleMarker(this.marker)

    if (!this.mapCenter) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.mapCenter = [ pos.coords.longitude, pos.coords.latitude ]
          console.log('INITIAL MAP CENTER', global.$j(this.mapCenter))
        })
      } else {
        this.mapCenter = cloneDeep(this.center)
        console.log('INITIAL MAP CENTER', global.$j(this.mapCenter))
      }
    }
  }
}
</script>

<style scoped>
.geo-layout {
  display: flex;
  flex-flow: column;
}

.geo-map {
  top: 0;
  left: 0;
  border: 1px solid gainsboro;
}

.geo-acionts {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.geo-centering {
  z-index: 50;
  position: absolute;
  bottom: 0;
  right: 0;
}
@media screen and (max-width: 800px) {

}
</style>
