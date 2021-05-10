const confirm = require('confirmer')

module.exports = async function shouldRemove (name) {
  const msg = `Do you want Qubit-CLI to remove ${name}? (y/n)`
  const result = await confirm(msg)
  return result
}
