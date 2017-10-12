const config = require('config')
const driftwood = require('driftwood')
const log = driftwood('Qubit-CLI')
log.enable({ '*': config.logger })
module.exports = log
