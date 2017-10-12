const log = require('../lib/log')
const qubitrc = require('../lib/qubitrc')

module.exports = async function logoutCmd (id) {
  try {
    await qubitrc.unsetEnv()
    log.info('You are now logged out!')
  } catch (err) {
    log.error(err)
  }
}
