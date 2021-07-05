const path = require('path')
const fs = require('fs-extra')
const checkExists = require('./exists')
const confirm = require('confirmer')

module.exports = async function shouldWrite (
  dest,
  name,
  newValue,
  shouldConfirm,
  shouldOverwrite,
  ignoreOverride
) {
  const msg = `Do you want Qubit-CLI to overwrite your local ${name} file? (y/n)`
  const file = path.join(dest, name)
  const exists = await checkExists(file)

  // file does not exist
  if (!exists) return true

  if (ignoreOverride) return false

  const currentValue = String(await fs.readFile(file))

  // no changes
  if (currentValue === newValue) return false

  if (shouldConfirm) {
    // permission
    const result = await confirm(msg)

    return result
  }

  return shouldOverwrite
}
