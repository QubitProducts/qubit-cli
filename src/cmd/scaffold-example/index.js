const path = require('path')
const readFiles = require('../../lib/read-files')
const scaffold = require('../../lib/scaffold')

module.exports = function () {
  return readFiles(path.resolve(__dirname, '../../../example'))
    .then((files) => scaffold(process.cwd(), files, true))
    .catch(console.error)
}
