const log = require('./log')
const path = require('path')
const fs = require('fs-extra')

module.exports = async function commonCodeWarning (dest, action, remoteFiles) {
  const commonFilePath = path.join(dest, './common.js')
  const utilsFilePath = path.join(dest, './utils.js')

  const [ commonFileExists, utilsFileExists ] = await Promise.all([fs.pathExists(commonFilePath), fs.pathExists(utilsFilePath)])
  // common.js exists locally in their directory and they havent ran qubit push/pull yet
  if (commonFileExists && !utilsFileExists) {
    log.info(`common.js will be utils.js going forward. Renaming local common.js to utils.js before ${action}ing...`)
    await fs.move(commonFilePath, utilsFilePath)
  }
}
