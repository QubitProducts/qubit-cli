const config = require('config')
const chalk = require('chalk')
const driftwood = require('driftwood/src/create')
const log = driftwood(logger)('Qubit-CLI')
log.enable({ '*': config.logger.level })
module.exports = log

function logger (name, level, now, { message, error, metadata }) {
  console.log(`${getPrefix(level)}    ${chalk.grey(highlighter(message))}`)
}

function highlighter (message) {
  return message
    .replace(/Qubit-CLI/g, chalk.white('Qubit-CLI'))
    .replace(/(http[^\s]+)/g, chalk.white('$1'))
    .replace(/(\([^)]+)/g, chalk.white('$1'))
    .replace(/([^\s]+\.(?:json|css|js))/g, chalk.white('$1'))
}

function getPrefix (level) {
  switch (level) {
    case 'warn': return chalk.red('?')
    case 'info': return chalk.green('✓')
    case 'error': return chalk.red('x')
  }
}
