const driftwood = require('driftwood')
const logger = driftwood('qubit-cli')
logger.enable({ '*': 'trace' })
module.exports = logger
