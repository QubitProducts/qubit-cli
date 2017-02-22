const path = require('path')
const chalk = require('chalk')
const fs = require('fs-promise')
let checkExists = require('./exists')
let confirm = require('confirmer')

module.exports = async function shouldWrite (dest, name, newValue, shouldConfirm) {
  const msg = `Do you want ${chalk.green.bold('xp')} to overwrite your local ${chalk.green.bold(name)} file?`
  const file = path.join(dest, name)
  let exists = await checkExists(file)
  // file does not exist - overwrite
  if (!exists) return true
  // if no ask handler, don't ever overwrite
  if (!shouldConfirm) return false
  let currentValue = await fs.readFile(file)

  currentValue = String(currentValue)
  // file is same as value - no need to write anything
  if (currentValue === newValue) return false
  // file exists and is different - ask permission
  if (shouldConfirm) {
    let result = await confirm(msg)
    if (process) {
      process.stdout.moveCursor(0, -1)
      process.stdout.clearScreenDown()
    }
    return result
  }
  return false
}
