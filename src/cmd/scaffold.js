const _ = require('lodash')
const path = require('path')
const scaffold = require('../lib/scaffold')
const readFiles = require('../lib/read-files')
const fs = require('fs-promise')
const exec = require('child_process').exec
let CWD = process.cwd()

module.exports = function scaffoldFromTemplate (template) {
  if (template === 'example') template = path.resolve(__dirname, '../../example-template')
  return exec(`npm link ${template}`, {
    cwd: path.resolve(__dirname, '../../')
  }, (err) => {
    if (err) return console.error(`could not find ${template} installed on your system`)
    let templateDir = path.dirname(require.resolve(template))
    return fs.readFile(path.join(CWD, 'package.json'))
      .then((str) => JSON.parse(str), () => {})
      .then((pkg) => {
        return readFiles(templateDir).then((files) => {
          let fileMap = Object.assign({}, files)
          // merge package.json instead of overwriting
          fileMap['package.json'] = Object.assign({}, pkg, fileMap['package.json'])

          let variations = _.get(pkg, 'meta.variations')

          // if experience has known variants, seed them from template
          if (variations && Object.keys(variations).length) {
            _.each(pkg.meta.variations, function (variation, fileName) {
              let meta = Object.assign({}, pkg.meta, variation)

              // allow templates to contain dynamic content based on package metadata
              fileMap[fileName + '.js'] = _.template(files['variation.js'])(meta)
              fileMap[fileName + '.css'] = _.template(files['variation.css'])(meta)
            })
            delete fileMap['variation.js']
            delete fileMap['variation.css']
          }

          return scaffold(CWD, fileMap)
        })
      })
  })
}
