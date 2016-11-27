const path = require('path')
const fs = require('fs-promise')
let CWD = process.cwd()

module.exports = async function getPkg () {
  return JSON.parse(String(await fs.readFile(path.join(CWD, 'package.json'))))
}
