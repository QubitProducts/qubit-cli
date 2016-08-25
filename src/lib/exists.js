const fs = require('fs-promise')

module.exports = function exists (path) {
  return fs.stat(path).then(
    () => true,
    (err) => err.code !== 'ENOENT' && thrower(err)
  )
}

function thrower (er) {
  throw er
}
