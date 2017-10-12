const path = require('path')
const fs = require('fs-extra')
const down = require('../services/down')
let CWD = process.cwd()

module.exports = async function updatePkg (experienceId) {
  const { files } = await down(experienceId)
  await fs.outputFile(path.join(CWD, 'package.json'), files['package.json'])
}
