const log = require('../lib/log')
const revokeToken = require('../lib/revoke-token')

module.exports = async function revokeTokenCmd (token) {
  await revokeToken(token)
  log.info(`Token revoked!`)
}
