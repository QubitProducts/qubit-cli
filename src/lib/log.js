const config = require('config')
const driftwood = require('driftwood/src/create')
const log = driftwood(logger)('Qubit-CLI')
const formatLog = require('./format-log')

log.enable({ '*': config.logger.level })
module.exports = log

function logger (name, level, now, { message, error, metadata }) {
  console.log(formatLog(message, level))
}
