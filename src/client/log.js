const createLogger = require('driftwood')
createLogger.enable({ '*': 'trace' })
module.exports = createLogger('xp')
