const { get: getProperty } = require('../services/property')
const { getPropertyId } = require('../lib/get-resource-ids')
const log = require('../lib/log')

module.exports = async function scopeCmd (pid) {
  const propertyId = await getPropertyId(pid)
  const property = await getProperty(propertyId)

  if (!property) {
    return log.error(`Property ${propertyId} does not exist or you do not have access to it.`)
  }

  log.info(`scope: ${property.scope}`)
}
