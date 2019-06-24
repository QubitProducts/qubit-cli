const chalk = require('chalk')

const ENV = process.env.NODE_ENV || 'development'

module.exports = function formatLog (message, level, error) {
  let prefix = getPrefix(level)
  let formatted = `${prefix}${chalk.grey(highlighter(message)).replace(/\n/g, '\n' + prefix)}`
  if (ENV === 'development' && error && error.stack) {
    formatted += '\n' + error.stack
  }
  return formatted
}

function highlighter (message) {
  return message
    .replace(/(http[^\s]+)/g, chalk.white('$1'))
    .replace(/([^\s]+\.(?:json|css|js))/g, chalk.white('$1'))
}

function getPrefix (level) {
  let symbol = getSymbol(level)
  return symbol ? `${symbol}    ` : ``
}

function getSymbol (level) {
  switch (level) {
    case 'question': return chalk.green('?')
    case 'warn': return chalk.green('?')
    case 'info': return chalk.green('✓')
    case 'error': return chalk.red('x')
    case 'debug': return chalk.white('ℹ')
    default: return false
  }
}
