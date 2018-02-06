const login = require('../server/lib/login')
const qubitrc = require('../lib/qubitrc')
const log = require('../lib/log')

module.exports = async function loginCmd (id) {
  try {
    await qubitrc.logout()
    await login()
    log.info('Login successful!')
  } catch (err) {
    log.error(err)
  }
}
