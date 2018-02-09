const log = require('../lib/log')
const qubitrc = require('../lib/qubitrc')
const login = require('../server/lib/login')
const { REGISTRY_SCOPES } = require('../constants')

module.exports = async function scopesCmd (id) {
  try {
    await login(false)
    let scopes = await qubitrc.get(REGISTRY_SCOPES)
    log.info(`You have access to the following scopes: ${scopes.join(', ').replace(/([^,]+),([^,]+)$/, '$1 and$2')}`)
  } catch (err) {
    log.error(err)
  }
}
