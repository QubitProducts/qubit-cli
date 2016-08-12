const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const bodyParser = require('body-parser')
const createEmitter = require('event-kitten')
const experienceCodeService = require('../services/experience-code')
const log = require('../lib/log')
const config = require('../../webpack.conf')

module.exports = function start (options) {
  let emitter = createEmitter()
  config.plugins = config.plugins || []
  config.plugins.push(new webpack.DefinePlugin({
    __WAIT__: !!options.require,
    __VARIATIONJS__: "'" + 'xp-loader!' + options.variation.replace(/\.js$/, '') + "'",
    __VARIATIONCSS__: "'" + options.variation.replace(/\.js$/, '.css') + "'"
  }))
  if (!options.watch) config.entry.pop()
  let compiler = webpack(config)
  compiler.plugin('done', (data) => emitter.emit('rebuild', data))
  let server = new WebpackDevServer(compiler, Object.assign(config.devServer, {
    https: options.certs
  }))
  server.app.use(bodyParser.json())
  server.app.use(function nocache (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  })
  server.app.post('/connect', require('./routes/connect'))

  if (options.sync) {
    emitter.on('rebuild', () => {
      log('syncing...')
      experienceCodeService.up(process.cwd()).then(() => {
        process.stdout.moveCursor(0, -1)
        process.stdout.clearScreenDown()
        log('synced!')
      }).catch(console.error)
    })
  }

  return {server, emitter}
}
