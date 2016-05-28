var path = require('path')
var readCode = require('./read')

module.exports = readCode(path.join(__dirname, '../../../../example'))
