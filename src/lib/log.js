const chalk = require('chalk')
module.exports = function log () {
  const msg = Array.prototype.join.call(arguments, ' ')
  console.log(chalk.gray(`${now()}:  ${chalk.white(msg)}`))
}

module.exports.error = function logError (err) {
  return console.log(chalk.gray(`${now()}:  ${err}`))
}

function now () {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
}
