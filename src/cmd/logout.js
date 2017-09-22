const fs = require('fs-extra')
const log = require('../lib/log')
const { NPMRC } = require('../lib/constants')

module.exports = async function logoutCmd (id) {
  try {
    await fs.remove(NPMRC)
    log('you are now logged out!')
  } catch (err) {
    log.error(err)
  }
}
