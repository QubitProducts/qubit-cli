const fs = require('../server/lib/login')
const os = require('os')
const log = require('../lib/log')
const NPMRC_FILE = `${os.homedir()}/.npmrc`

module.exports = async function logoutCmd (id) {
  try {
    await fs.remove(NPMRC_FILE)
  } catch (err) {
    log.error(err)
  }
}
