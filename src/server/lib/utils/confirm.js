var confirmer = require('confirmer')
var queue = []

module.exports = function confirm (question) {
  var l = queue.length
  queue.push(l
    ? queue[l - 1].then(() => getConfirmation(question).then(unshift))
    : getConfirmation(question).then(unshift)
  )
  return queue[l]
}

function unshift (result) {
  queue.unshift()
  return result
}

function getConfirmation (question) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      return confirmer(question)
        .then(function (result) {
          if (!result) {
            var lines = question.match(/\n/g)
            lines = (lines ? lines.length : 0) + 1
            process.stdout.moveCursor(0, -lines)
            process.stdout.clearScreenDown()
          }
          return result
        })
        .then(resolve, reject)
    }, 10)
  })
}
