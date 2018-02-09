const logger = require('driftwood')('Qubit-CLI')
logger.enable({ '*': 'trace' })
module.exports = logger
