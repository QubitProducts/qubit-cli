const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
let checkExists = require('./exists')
let confirm = require('confirmer')

module.exports = async function shouldWrite (dest, name, newValue) {
  const msg = `Do you want ${chalk.green.bold('xp')} to overwrite your local ${chalk.green.bold(name)} file?`
  const file = path.join(dest, name)
  let exists = await checkExists(file)

  // file does not exist
  if (!exists) return true

  let currentValue = String(await fs.readFile(file))

  // no changes
  if (currentValue === newValue) return false

  // permission
  let result = await confirm(msg)
  if (process) {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearScreenDown()
  }

  return result
}
