const chalk = require('chalk')
module.exports = function log () {
  let msg = Array.prototype.join.call(arguments, ' ')
  console.log(chalk.gray(`${now()}:  ${chalk.white(msg)}`))
}

module.exports.catchLog = function logError (fn) {
  return fn().catch((err) => console.log(chalk.gray(`${now()}:  ${chalk.redd(err.stack)}`)))
}

function now () {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
}
