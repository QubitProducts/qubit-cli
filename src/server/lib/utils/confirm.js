var confirmer = require('confirmer')

module.exports = function confirm (msg) {
  return confirmer(msg).then(function (result) {
    if (!result) {
      // cleanup
      var lines = msg.match(/\n/g)
      lines = (lines ? lines.length : 0) + 1
      process.stdout.moveCursor(0, -lines)
      process.stdout.clearScreenDown()
    }
    return result
  })
}
