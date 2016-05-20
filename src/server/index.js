var WebpackDevServer = require('webpack-dev-server')
var bodyParser = require('body-parser')
var routes = require('./routes')
var compiler = require('./lib/compiler')
var config = require('../../webpack.conf.js')

var server = new WebpackDevServer(compiler, config.devServer)
server.app.use(bodyParser.json())
routes(server.app)

module.exports = server
