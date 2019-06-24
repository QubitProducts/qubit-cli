const path = require('path')
const fs = require('fs-extra')
// const log = require('./log')

// This is a placeholder for when pre script is released
module.exports = async function renameFileWarning (dest) {
  const exists = await fs.pathExists(path.join(dest, 'global.js'))
  if (exists) {
    // log.warn(`global.js is being deprecated in favour of better solutions such as packages and pre-script`)
  }
}
