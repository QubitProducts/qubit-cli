var webpack = require('webpack')
var config = require('../../../webpack.conf')
var events = require('./utils/events')
var compiler = webpack(config)
compiler.plugin('done', (data) => events.emit('rebuild', data))
module.exports = compiler
