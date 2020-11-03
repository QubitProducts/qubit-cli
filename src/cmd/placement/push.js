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
const payloadKeys = f => Object.keys(JSON.parse(f['payload.json'])).sort()

module.exports = async function push (options = {}) {
  await throwIf.placement('push')
  const pkg = await getPkg()
  const propertyId = await getPropertyId(null, pkg)
  const placementId = await getPlacementId(propertyId, null, pkg)
  const localFiles = await readFiles(CWD)
  const remoteFiles = await placementService.get(propertyId, placementId)
  if (!_.isEqual(payloadKeys(localFiles), payloadKeys(remoteFiles))) {
    log.error(chalk.bold.red(`You can only modify the values of payload.json
Please use the online editor to change the structure
run "qubit placement open" to access the schema editor
and then "qubit placement pull" to pull down the changes`
    ))
    return
  }

  if (!options.force) {
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
  const files = await placementService.set(propertyId, placementId, localFiles)
  await writePkg(files['package.json'])
  log.info('Pushed!')
}
