const log = require('../lib/log')
const qubitrc = require('../lib/qubitrc')
const { getRegistryToken } = require('../lib/get-delegate-token')
const { REGISTRY_SCOPES } = require('../constants')

module.exports = async function scopesCmd (id) {
  await getRegistryToken()
  const scopes = await qubitrc.get(REGISTRY_SCOPES)
  log.info(
    `You have access to the following scopes: ${scopes
      .join(', ')
      .replace(/([^,]+),([^,]+)$/, '$1 and$2')}`
  )
}
