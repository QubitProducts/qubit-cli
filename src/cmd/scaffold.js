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
          fileMap['package.json'] = JSON.stringify(Object.assign({}, pkg, fileMap['package.json']), null, 2)

          let variations = _.get(pkg, 'meta.variations')

          if (files['global.js']) fileMap['global.js'] = _.template(files['global.js'])(pkg.meta)
          if (files['triggers.js']) fileMap['triggers.js'] = _.template(files['triggers.js'])(pkg.meta)

          // if experience has known variants, seed them from template
          if (variations && Object.keys(variations).length) {
            _.each(pkg.meta.variations, function (variation, fileName) {
              let meta = Object.assign({}, pkg.meta, variation)

              // allow templates to contain dynamic content based on package metadata
              if (files['variation.js']) fileMap[fileName + '.js'] = _.template(files['variation.js'])(meta)
              if (files['variation.css']) fileMap[fileName + '.css'] = _.template(files['variation.css'])(meta)
            })
            delete fileMap['variation.js']
            delete fileMap['variation.css']
          }

          return scaffold(CWD, fileMap)
        })
        .catch((err) => console.log(err.stack))
      })
  })
}
