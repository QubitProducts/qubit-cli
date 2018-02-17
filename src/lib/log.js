const _ = require('lodash')
const config = require('../../config')
const driftwood = require('driftwood/src/create')
const log = driftwood(logger)('Qubit-CLI')
const formatLog = require('./format-log')
const spacer = _.once(spacing)

log.enable({ '*': config.logger.level })
module.exports = log

function spacing () {
  console.log('')
  process.on('exit', () => console.log(''))
}

function logger (name, level, now, { message, error, metadata }) {
  spacer()
  console.log(formatLog(message, level))
}
