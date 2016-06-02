var path = require('path')
var chalk = require('chalk')
var fs = require('fs-promise')
var examples = require('./examples')
var confirm = require('../utils/confirm')
var addExtension = require('../utils/add-extension')

module.exports = function scaffold (dest, codes, ask, log) {
  return examples.then((examples) => {
    if (!codes) return scaffold(dest, examples, ask, log)
    return Promise.all(Object.keys(codes).map(function next (name) {
      var value = codes[name]
      var file = path.join(dest, addExtension(name))
      var msg
      if (ask) {
        msg = `Should ${chalk.green.bold('xp')} overwrite your local ${chalk.green.bold(name)} file with remote's?`
      }
      return shouldOverwrite(file, value, examples[name], msg)
        .then((result) => {
          if (result) {
            if (log) log(`overwriting local ${chalk.green.bold(name)} file...`)
            return fs.writeFile(file, value)
          }
        })
    }))
  })
}

function shouldOverwrite (file, newValue, defaultValue, ask) {
  return exists(file).then((exists) => {
    // file does not exist - overwrite
    if (!exists) return true
    // if no ask handler, don't ever overwrite
    if (!ask) return false
    return fs.readFile(file).then((currentValue) => {
      currentValue = String(currentValue)
      // file is same as remote - no need to overwrite
      if (currentValue === newValue) return false
      // file is just the example file - ok to overwrite
      if (currentValue === defaultValue) return true
      // file exists and is different from example - ask permission
      return ask ? confirm(ask) : false
    })
  })
}

function exists (path) {
  return fs.stat(path).then(() => true, function (err) {
    if (err.code === 'ENOENT') return false
    throw err
  })
}
