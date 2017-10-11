const driftwood = require('driftwood')
const log = driftwood('Qubit-CLI')
log.enable({ '*': 'trace' })
module.exports = log
