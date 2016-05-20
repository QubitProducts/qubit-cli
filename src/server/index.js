var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var bodyParser = require('body-parser')
var createEmitter = require('event-kitten')
var config = require('../../webpack.conf')
var createSyncRoute = require('./routes/sync')

module.exports = function createServer (options) {
  var events = createEmitter()
  config.plugins = config.plugins || []
  config.plugins.push(new webpack.DefinePlugin({
    __WAIT__: !!options.wait
  }))
  var compiler = webpack(config)
  compiler.plugin('done', (data) => events.emit('rebuild', data))
  var server = new WebpackDevServer(compiler, config.devServer)
  server.app.use(bodyParser.json())
  server.app.post('/sync', createSyncRoute(events))
  return server
}
