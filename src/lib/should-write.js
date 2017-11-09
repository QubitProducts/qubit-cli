const path = require('path')
const fs = require('fs-extra')
let checkExists = require('./exists')
let confirm = require('confirmer')
const readline = require('readline')

module.exports = async function shouldWrite (dest, name, newValue, shouldConfirm, shouldOverwrite) {
  const msg = `Do you want Qubit-CLI to overwrite your local ${name} file?`
  const file = path.join(dest, name)
  let exists = await checkExists(file)

  // file does not exist
  if (!exists) return true

  let currentValue = String(await fs.readFile(file))

  // no changes
  if (currentValue === newValue) return false

  if (shouldConfirm) {
    // permission
    let result = await confirm(msg)
    if (process) {
      readline.cursorTo(process.stdout, 0, -1)
      readline.clearScreenDown(process.stdout)
    }

    return result
  }

  return shouldOverwrite
}
