var chalk = require('chalk')
module.exports = function log () {
  var msg = Array.prototype.join.call(arguments, ' ')
  console.log(chalk.gray(`${now()}:  ${chalk.white(msg)}`))
}

function now () {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
}
