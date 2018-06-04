const path = require('path')
const fs = require('fs-extra')
let CWD = process.cwd()

module.exports = async function getPkg (root) {
  root = root || CWD
  try {
    let file = await fs.readFile(path.join(root, 'package.json'))
    return JSON.parse(String(file))
  } catch (err) {
    if (err.message.includes('ENOENT: no such file')) return {}
    throw err
  }
}
