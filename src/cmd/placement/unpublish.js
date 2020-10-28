const log = require('../../lib/log')
const { getPropertyId, getPlacementId } = require('../../lib/get-resource-ids')
const getPkg = require('../../lib/get-pkg')
const throwIf = require('../../lib/throw-if')
const placementStatus = require('../../lib/placement-status')
const placementService = require('../../services/placement')

module.exports = async function unpublish (options = {}) {
  await throwIf.placement('unpublish')
  const pkg = await getPkg()
  const propertyId = await getPropertyId(null, pkg)
  const placementId = await getPlacementId(propertyId, null, pkg)

  log.info('Unpublishing placement...')
  await placementService.unpublish(propertyId, placementId)
  await placementStatus(propertyId, placementId)
}
