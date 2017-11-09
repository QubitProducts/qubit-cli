let confirm = require('confirmer')
const readline = require('readline')

module.exports = async function shouldRemove (name) {
  const msg = `Do you want Qubit-CLI to remove ${name}?`
  let result = await confirm(msg)
  if (process) {
    readline.cursorTo(process.stdout, 0, -1)
    readline.clearScreenDown(process.stdout)
  }
  return result
}
