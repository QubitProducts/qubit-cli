const fs = require('fs-promise')

module.exports = function exists (path) {
  return fs.readFile(path).then(() => true, () => false)
}
