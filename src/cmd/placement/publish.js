const _ = require('lodash')
const chalk = require('chalk')
const log = require('../../lib/log')
const { getPropertyId, getPlacementId } = require('../../lib/get-resource-ids')
const logDiff = require('../../lib/log-diff')
const getDiff = require('../../lib/get-diff')
const getPkg = require('../../lib/get-pkg')
const placementStatus = require('../../lib/placement-status')
const throwIf = require('../../lib/throw-if')
const placementService = require('../../services/placement')

const CWD = process.cwd()

module.exports = async function publish (options = {}) {
  await throwIf.placement('publish')
  const pkg = await getPkg()
  const propertyId = await getPropertyId(null, pkg)
  const placementId = await getPlacementId(propertyId, null, pkg)

  if (!options.force) {
    const remoteFiles = await placementService.get(propertyId, placementId)
    const remoteUpdatedAt = _.get(JSON.parse(remoteFiles['package.json']), 'meta.remoteUpdatedAt')
    const localUpdatedAt = pkg.meta.remoteUpdatedAt

    if (remoteUpdatedAt !== localUpdatedAt) {
      const diffs = await getDiff.placement(CWD, propertyId, placementId, 'draft')
      if (diffs.length) {
        log.error(chalk.bold.red('Remote has changed!'))
        return logDiff(diffs)
      }
    }
  }

  log.info('Publishing placement...')
  await placementService.publish(propertyId, placementId)
  await placementStatus(propertyId, placementId)
}
