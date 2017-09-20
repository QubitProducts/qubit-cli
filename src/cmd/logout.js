const fs = require('../server/lib/login')
const os = require('os')
const log = require('../lib/log')
const npmrcFile = `${os.homedir()}/.npmrc`

module.exports = async function logoutCmd (id) {
  try {
    await fs.remove(npmrcFile)
  } catch (err) {
    log.error(err)
  }
}
