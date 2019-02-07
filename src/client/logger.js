const driftwood = require('driftwood')
const logger = driftwood('qubit-cli')

module.exports = function createVariationLogger (meta) {
  logger.enable({ '*': 'trace' })
  logger.log = function () {
    logger.info.apply(logger.info, arguments)
  }
  return logger
}
