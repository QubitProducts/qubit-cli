let confirm = require('confirmer')
let clearLine = require('./clear-line')

module.exports = async function shouldRemove (name) {
  const msg = `Do you want Qubit-CLI to remove ${name}?`
  let result = await confirm(msg)
  clearLine()
  return result
}
