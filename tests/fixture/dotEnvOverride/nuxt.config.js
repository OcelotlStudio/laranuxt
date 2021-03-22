const { resolve } = require('path')

module.exports = {
  ssr: false,
  rootDir: __dirname,
  buildDir: resolve(__dirname, '.nuxt'),
  modules: [require('../../../src/module').default],
}
