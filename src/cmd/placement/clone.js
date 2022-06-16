const path = require('path')
const placementService = require('../../services/placement')
const { getPropertyId, getPlacementId } = require('../../lib/get-resource-ids')
const isOneOf = require('../../lib/is-one-of')(['active', 'draft'])
const getPkg = require('../../lib/get-pkg')
const scaffold = require('../../lib/scaffold')
const throwIf = require('../../lib/throw-if')
const log = require('../../lib/log')

const CWD = process.cwd()

module.exports = async function clone (
  propertyIdOrUrl,
  placementId,
  implementationType = 'draft'
) {
  await throwIf.none('clone')
  isOneOf(implementationType)
  const pkg = await getPkg()
  const propertyId = await getPropertyId(propertyIdOrUrl, pkg)
  placementId = await getPlacementId(
    propertyIdOrUrl || propertyId,
    placementId,
    pkg
  )
  const files = await placementService.addHelpers(
    await placementService.get(propertyId, placementId)
  )
  if (!files) throw new Error(`Placement '${placementId}' not found`)
  const destination = path.join(CWD, `placement-${propertyId}-${placementId}`)
  await scaffold(destination, files, { removeExtraneous: true })
  log.info(`placement cloned into ${destination}`)
  return destination
}
