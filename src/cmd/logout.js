const log = require('../lib/log')
const qubitrc = require('../lib/qubitrc')

module.exports = async function logoutCmd (id) {
  await qubitrc.logout()
  log.info('Logout successful!')
}
