const chalk = require('chalk')

module.exports = function formatLog (message, level) {
  return `${getPrefix(level)}    ${chalk.grey(highlighter(message))}`
}

function highlighter (message) {
  return message
    .replace(/Qubit-CLI/g, chalk.white('Qubit-CLI'))
    .replace(/(http[^\s]+)/g, chalk.white('$1'))
    .replace(/([^\s]+\.(?:json|css|js))/g, chalk.white('$1'))
}

function getPrefix (level) {
  switch (level) {
    case 'warn': return chalk.red('?')
    case 'info': return chalk.green('✓')
    case 'error': return chalk.red('x')
    default: return ' '
  }
}
