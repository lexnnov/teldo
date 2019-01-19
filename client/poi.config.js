const path = require('path')
const pkg = require('./package')

module.exports = {
  devServer: {
    proxy: {
      '/addTask': {
        target: 'http://localhost:3008',
        ws: true,
        changeOrigin: true
      },
      '/getTasks': {
        target: 'http://localhost:3008',
        ws: true,
        changeOrigin: true
      },
      '/setTask': {
        target: 'http://localhost:3008',
        ws: true,
        changeOrigin: true
      }
    }
  },
  entry: [
    'src/polyfills.js',
    'src/index.js'
  ],
  html: {
    title: pkg.productName,
    description: pkg.description,
    template: path.join(__dirname, 'index.ejs')
  },
  postcss: {
    plugins: [
      // Your postcss plugins
    ]
  },
  presets: [
    require('poi-preset-bundle-report')(),
    require('poi-preset-offline')({
      pwa: './src/pwa.js', // Path to pwa runtime entry
      pluginOptions: {} // Additional options for offline-plugin
    })
  ]
}
