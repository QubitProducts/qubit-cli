const fs = require('fs-promise')

module.exports = async function exists (path) {
  try {
    await fs.stat(path)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') return false
    throw err
  }
}
