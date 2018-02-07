const readline = require('readline')

module.exports = function clearLine () {
  if (process) {
    readline.cursorTo(process.stdout, 0, -1)
    readline.clearScreenDown(process.stdout)
  }
}
