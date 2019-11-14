const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  publicPath: '/',

  // where to output built files
  outputDir: 'dist',

  devServer: {
    inline: false,
    proxy: {
      "/socket.io": {
        target: "http://localhost:4093/socket.io",
        ws: true
      },
      "/api": {
        target: "http://localhost:4093",
      }
    },
    https: true
  },

  configureWebpack: {
    output: {
      publicPath: '/'
    },
    watchOptions: {
      ignored: 'service-worker.js'
    },
    plugins: [
      new VuetifyLoaderPlugin()
    ]
  },

  pwa: {
    workboxOptions: {
      navigateFallback: '/'
    }
  },

  transpileDependencies: [
    '@ignitial/iio-app-client'
  ]
}
