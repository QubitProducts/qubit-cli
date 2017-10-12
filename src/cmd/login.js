const login = require('../server/lib/login')
const log = require('../lib/log')

module.exports = async function loginCmd (id) {
  try {
    await login(true)
    log.info('Login successful!')
  } catch (err) {
    log.error(err)
  }
}
