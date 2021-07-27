const placementService = require('../../services/placement')
const { getPropertyId, getPlacementId } = require('../../lib/get-resource-ids')
const isOneOf = require('../../lib/is-one-of')(['active', 'draft'])
const getPkg = require('../../lib/get-pkg')
const scaffold = require('../../lib/scaffold')
const throwIf = require('../../lib/throw-if')
const log = require('../../lib/log')

const CWD = process.cwd()

module.exports = async function pull (
  propertyIdorUrl,
  placementId,
  implementationType = 'draft'
) {
  await throwIf.placement('pull')
  isOneOf(implementationType)
  const pkg = await getPkg()
  const propertyId = await getPropertyId(propertyIdorUrl, pkg)
  placementId = await getPlacementId(propertyIdorUrl, placementId, pkg)
  const files = await placementService.get(
    propertyId,
    placementId,
    implementationType
  )
  if (!files) throw new Error(`Placement '${placementId}' not found`)
  await scaffold(CWD, files)
  log.info('placement pulled')
}
