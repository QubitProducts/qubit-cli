let confirm = require('confirmer')

module.exports = async function shouldRemove (name) {
  const msg = `Do you want Qubit-CLI to remove ${name}?`
  let result = await confirm(msg)
  if (process) {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearScreenDown()
  }
  return result
}
