const down = require('../services/down')
const writePkg = require('./write-pkg')

module.exports = async function updatePkg (experienceId) {
  const { files } = await down(experienceId)
  await writePkg(files['package.json'])
}
