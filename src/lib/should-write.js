const path = require('path')
const fs = require('fs-extra')
let checkExists = require('./exists')
let confirm = require('confirmer')

module.exports = async function shouldWrite (dest, name, newValue, shouldConfirm, shouldOverwrite) {
  const msg = `Do you want Qubit-CLI to overwrite your local ${name} file? (y/n)`
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

    return result
  }

  return shouldOverwrite
}
