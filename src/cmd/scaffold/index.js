const path = require('path')
const scaffold = require('../../lib/scaffold')
const readFiles = require('../../lib/read-files')
const exec = require('child_process').exec

module.exports = function scaffoldFromTemplate (template) {
  return exec(`npm link ${template}`, {
    cwd: path.resolve(__dirname, '../../../')
  }, (err) => {
    if (err) return console.error(`could not find ${template} installed on your system`)
    let templateDir = path.dirname(require.resolve(template))
    return readFiles(templateDir).then((files) => {
      return scaffold(process.cwd(), files)
    })
  })
}
