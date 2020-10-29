const log = require('../../lib/log')
const { getPropertyId, getPlacementId } = require('../../lib/get-resource-ids')
const getPkg = require('../../lib/get-pkg')
const placementStatus = require('../../lib/placement-status')
const throwIf = require('../../lib/throw-if')
const placementService = require('../../services/placement')
const push = require('./push')

module.exports = async function publish (options = {}) {
  await throwIf.placement('publish')
  const pkg = await getPkg()
  const propertyId = await getPropertyId(null, pkg)
  const placementId = await getPlacementId(propertyId, null, pkg)

  await push(options)

  log.info('Publishing placement...')
  await placementService.publish(propertyId, placementId)
  await placementStatus(propertyId, placementId)
}
