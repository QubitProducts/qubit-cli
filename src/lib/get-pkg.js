const path = require('path')
const CWD = process.cwd()

module.exports = function getPkg (root) {
  root = root || CWD
  try {
    return require(path.join(root, 'package.json'))
  } catch (err) {
    if (err.message.includes('ENOENT: no such file')) return {}
    throw err
  }
}
