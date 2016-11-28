const path = require('path')
const chalk = require('chalk')
const fs = require('fs-promise')
const log = require('./log')
let shouldWrite = require('./should-write')

module.exports = async function scaffold (dest, files, neverOverwrite) {
  for (let name in files) {
    if (files.hasOwnProperty(name)) {
      const value = files[name]
      if (typeof value === 'string') {
        await scaffoldFile(name)
      } else {
        await fs.mkdirp(path.join(dest, name))
        await scaffold(path.join(dest, name), value, neverOverwrite)
      }
    }
  }

  async function scaffoldFile (name) {
    const value = files[name]
    let result = await shouldWrite(dest, name, value, !neverOverwrite)
    if (result) {
      if (log) log(`writing to local ${chalk.green.bold(name)} file...`)
      return fs.writeFile(path.join(dest, name), value)
    }
  }
}
