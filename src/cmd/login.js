const login = require('../server/lib/login')
const log = require('../lib/log')
const qubitrc = require('../lib/qubitrc')

module.exports = async function loginCmd (id) {
  try {
    await login(await qubitrc.switched())
    log.info('Login successful!')
  } catch (err) {
    log.error(err)
  }
}
