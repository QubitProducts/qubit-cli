var chalk = require('chalk')
module.exports = function log (msg) {
  console.log(chalk.gray(`${now()}:  ${chalk.white(msg)}`))
}

function now () {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
}
