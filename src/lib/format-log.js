const chalk = require('chalk')

module.exports = function formatLog (message, level) {
  return `${getPrefix(level)}${chalk.grey(highlighter(message))}`
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
    case 'warn': return chalk.green('?')
    case 'info': return chalk.green('✓')
    case 'error': return chalk.red('x')
    case 'debug': return chalk.white('ℹ')
    default: return false
  }
}
