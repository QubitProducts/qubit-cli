const fs = require('fs-extra')

module.exports = async function exists (path) {
  try {
    await fs.stat(path)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') return false
    throw err
  }
}
