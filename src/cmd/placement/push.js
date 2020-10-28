const _ = require('lodash')
const chalk = require('chalk')
const log = require('../../lib/log')
const { getPropertyId, getPlacementId } = require('../../lib/get-resource-ids')
const logDiff = require('../../lib/log-diff')
const getDiff = require('../../lib/get-diff')
const getPkg = require('../../lib/get-pkg')
const throwIf = require('../../lib/throw-if')
const placementService = require('../../services/placement')
const readFiles = require('../../lib/read-files')
const writePkg = require('../../lib/write-pkg')

const CWD = process.cwd()

module.exports = async function push (options = {}) {
  await throwIf.placement('push')
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

  log.info('Pushing draft...')
  const files = await placementService.set(propertyId, placementId, await readFiles(CWD))
  await writePkg(files['package.json'])
  log.info('Pushed!')
}
