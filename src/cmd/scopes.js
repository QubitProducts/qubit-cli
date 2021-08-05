const { uniq } = require('lodash')

const log = require('../lib/log')
const propertyService = require('../services/property')
const { getPropertyId } = require('../lib/get-resource-ids')

module.exports = async function scopesCmd (pid) {
  if (pid) {
    const propertyId = await getPropertyId(pid)
    const property = await propertyService.get(propertyId)

    if (!property) {
      return log.error(`Property ${propertyId} does not exist or you do not have access to it.`)
    }

    return log.info(property.scope)
  }

  const properties = await propertyService.getAll()
  const scopes = uniq(properties.map(({ scope }) => scope)).sort()

  log.info(scopes.join('\n'))
}
