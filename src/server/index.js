var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var bodyParser = require('body-parser')
var createEmitter = require('event-kitten')
var config = require('../../webpack.conf')
var sync = require('./routes/sync')

module.exports = function createServer (options) {
  var emitter = createEmitter()
  config.plugins = config.plugins || []
  config.plugins.push(new webpack.DefinePlugin({
    __WAIT__: !!options.wait
  }))
  if (!options.watch) config.entry.experience.pop()
  var compiler = webpack(config)
  compiler.plugin('done', (data) => emitter.emit('rebuild', data))
  var server = new WebpackDevServer(compiler, Object.assign(config.devServer, {
    https: options.certs
  }))
  server.app.use(bodyParser.json())
  server.app.post('/sync', sync(emitter))
  return server
}
