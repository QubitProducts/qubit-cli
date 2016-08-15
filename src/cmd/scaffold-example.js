const path = require('path')
const readFiles = require('../lib/read-files')
const scaffold = require('../lib/scaffold')
let CWD = process.cwd()

module.exports = function (options) {
  return readFiles(path.resolve(__dirname, '../../../example'))
    .then((files) => scaffold(CWD, files, true))
}
