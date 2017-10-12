const config = require('config')
const driftwood = require('driftwood')
const log = driftwood('Qubit-CLI')
log.enable({ '*': config.logger.level })
module.exports = log
