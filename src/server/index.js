const bodyParser = require('body-parser')
const express = require('express')
const createEmitter = require('event-kitten')
const up = require('../cmd/up')
const log = require('../lib/log')
const webpack = require('webpack')
const https = require('https')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConf = require('../../webpack.conf')
const app = express()

module.exports = function start (options) {
  let emitter = createEmitter()
  if (options.sync) {
    log('watching for changes')
    emitter.on('rebuild', up)
  }
  let compiler = webpack(createWebpackConfig(options))
  compiler.plugin('done', (data) => emitter.emit('rebuild', data))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    quiet: true,
    publicPath: webpackConf.output.publicPath
  }))
  app.use(webpackHotMiddleware(compiler, {
    log: false,
    warn: false,
    reload: true,
    noInfo: true,
    quiet: true,
    path: '/__webpack_hmr',
    heartbeat: 100
  }))
  app.use(bodyParser.json())
  app.post('/connect', require('./routes/connect'))
  const server = https.createServer(options.certs, app)
  return {server, emitter}
}

function createWebpackConfig (options) {
  let plugins = webpackConf.plugins.slice(0)
  plugins.push(new webpack.DefinePlugin({
    __VARIATIONJS__: "'" + 'xp-loader!' + options.variation.replace(/\.js$/, '') + "'",
    __VARIATIONCSS__: "'" + options.variation.replace(/\.js$/, '.css') + "'"
  }))
  let entry = webpackConf.entry.slice(0)
  if (!options.sync && !options.watch) entry.pop()
  return Object.assign({}, webpackConf, {
    entry: entry,
    plugins: plugins
  })
}
