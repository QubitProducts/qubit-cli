const path = require('path')
const fs = require('fs-extra')
const log = require('./log')
const exists = require('./exists')
const shouldWrite = require('./should-write')
const shouldRemove = require('./should-remove')

module.exports = async function scaffold (dest, files, options = {}) {
  const {
    shouldConfirm = true,
    shouldOverwrite = false,
    removeExtraneous = false
  } = options
  for (const name in files) {
    if (Object.prototype.hasOwnProperty.call(files, name)) {
      const value = files[name]
      if (typeof value === 'string') {
        await scaffoldFile(name)
      } else {
        await fs.mkdirp(path.join(dest, name))
        await scaffold(path.join(dest, name), value, options)
      }
    }
  }

  if (removeExtraneous && (await exists(dest))) {
    const actual = await fs.readdir(dest)
    const extraneous = actual.filter(file => !Object.keys(files).includes(file))
    await Promise.all(
      extraneous.map(async file => {
        if (!/\.(css|js)$/.test(file)) return
        if (!shouldConfirm || (await shouldRemove(file))) {
          return fs.remove(path.join(dest, file))
        }
      })
    )
  }

  async function scaffoldFile (name, ignoreOverride) {
    const value = files[name]
    const result = await shouldWrite(
      dest,
      name,
      value,
      shouldConfirm,
      shouldOverwrite,
      ignoreOverride
    )
    if (result) {
      if (log) log.info(`Writing to local ${name} file...`)
      return fs.outputFile(path.join(dest, name), value)
    }
  }
}
