const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const log = require('./log')
const exists = require('./exists')
let shouldWrite = require('./should-write')
let shouldRemove = require('./should-remove')

module.exports = async function scaffold (dest, files, shouldConfirm = true, shouldOverwrite = false, removeExtraneous = false) {
  for (let name in files) {
    if (files.hasOwnProperty(name)) {
      const value = files[name]
      if (typeof value === 'string') {
        await scaffoldFile(name)
      } else {
        await fs.mkdirp(path.join(dest, name))
        await scaffold(path.join(dest, name), value, shouldConfirm, shouldOverwrite, removeExtraneous)
      }
    }
  }

  if (removeExtraneous && await exists(dest)) {
    const actual = await fs.readdir(dest)
    const extraneous = actual.filter(file => !Object.keys(files).includes(file))
    await Promise.all(extraneous.map(async file => {
      if (!shouldConfirm || await shouldRemove(file)) return fs.remove(path.join(dest, file))
    }))
  }

  async function scaffoldFile (name) {
    const value = files[name]
    let result = shouldConfirm
      ? await shouldWrite(dest, name, value)
      : shouldOverwrite
    if (result) {
      if (log) log.info(`Writing to local ${chalk.green.bold(name)} file...`)
      return fs.outputFile(path.join(dest, name), value)
    }
  }
}
