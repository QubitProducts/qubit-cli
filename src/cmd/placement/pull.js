const placementService = require('../../services/placement')
const { getPropertyId, getPlacementId } = require('../../lib/get-resource-ids')
const isOneOf = require('../../lib/is-one-of')(['active', 'draft'])
const getPkg = require('../../lib/get-pkg')
const scaffold = require('../../lib/scaffold')
const throwIf = require('../../lib/throw-if')
const log = require('../../lib/log')

const CWD = process.cwd()

module.exports = async function pull (
  propertyId,
  placementId,
  implementationType = 'draft'
) {
  await throwIf.placement('pull')
  isOneOf(implementationType)
  const pkg = await getPkg()
  propertyId = await getPropertyId(propertyId, pkg)
  placementId = await getPlacementId(propertyId, placementId, pkg)
  const files = await placementService.get(
    propertyId,
    placementId,
    implementationType
  )
  if (!files) throw new Error(`Placement '${placementId}' not found`)
  await scaffold(CWD, files, { filesToIgnoreOverride: 'placement.test.js' })
  log.info('placement pulled')
}
