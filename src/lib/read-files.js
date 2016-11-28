const path = require('path')
const fs = require('fs-promise')
const _ = require('lodash')

function readFiles (dest) {
  return fs.readdir(dest).then(reduce)

  function reduce (files) {
    return Promise.all(files.map(readFile))
      .then((values) => _.zipObject(files, values))
      .then((obj) => _.omit(obj, (val) => val instanceof Error))
  }

  function readFile (file) {
    const target = path.join(dest, file)
    return fs.readFile(target).then(String, (err) => {
      if (err.code === 'EISDIR') return readFiles(target)
      return err
    })
  }
}

module.exports = readFiles
