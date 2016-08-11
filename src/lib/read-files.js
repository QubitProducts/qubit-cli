const path = require('path')
const fs = require('fs-promise')
const _ = require('lodash')

module.exports = function readFiles (dest) {
  return fs.readdir(dest).then(reduce)

  function reduce (files) {
    return Promise.all(files.map(readFile))
      .then((values) => _.zipObject(files, values))
      .then((obj) => _.omit(obj, (val) => val instanceof Error))
      .then((obj) => _.mapValues(obj, String))
  }

  function readFile (file) {
    return fs.readFile(path.join(dest, file)).catch((err) => err)
  }
}
