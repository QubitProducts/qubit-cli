const path = require('path')
const fs = require('fs-extra')
const confirmer = require('confirmer')

module.exports = async function commonCodeWarning (dest, remoteFiles) {
  const commonFilePath = path.join(dest, './common.js')
  const utilsFilePath = path.join(dest, './utils.js')

  const [ commonFileExists, utilsFileExists ] = await Promise.all([fs.pathExists(commonFilePath), fs.pathExists(utilsFilePath)])
  if (commonFileExists && !utilsFileExists) {
    const result = await confirmer('common.js is now utils.js, is it ok to rename your common.js file?')
    // keep local common.js and add blank utils.js
    if (!result) await fs.touch(utilsFilePath)
    // rename local common.js to utils.js
    return fs.move(commonFilePath, utilsFilePath)
  }
}
