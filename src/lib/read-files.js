const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')
const defaultIgnore = /^(\.git|node_modules)/

function readFiles (dest, ignore) {
  ignore = ignore || defaultIgnore

  return fs
    .readdir(dest)
    .then(filter)
    .then(reduce)

  function reduce (files) {
    return Promise.all(files.map(readFile))
      .then(values => _.zipObject(files, values))
      .then(obj => _.omit(obj, val => val instanceof Error))
  }

  function readFile (file) {
    const target = path.join(dest, file)
    return fs.readFile(target).then(String, err => {
      if (err.code === 'EISDIR') return readFiles(target, ignore)
      return err
    })
  }

  function filter (files) {
    if (!ignore) return files
    return files.filter(file => !ignore.test(file))
  }
}

module.exports = readFiles
