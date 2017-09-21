const fs = require('fs-extra')
const os = require('os')
const log = require('../lib/log')
const NPMRC_FILE = `${os.homedir()}/.npmrc`

module.exports = async function logoutCmd (id) {
  try {
    await fs.remove(NPMRC_FILE)
    log('you are now logged out!')
  } catch (err) {
    log.error(err)
  }
}
