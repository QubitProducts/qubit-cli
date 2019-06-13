const chalk = require('chalk')
const log = require('../../lib/log')
const logDiff = require('../../lib/log-diff')
const getDiff = require('../../lib/get-diff')
const getPkg = require('../../lib/get-pkg')
const throwIf = require('../../lib/throw-if')
const preService = require('../../services/pre')
const readFiles = require('../../lib/read-files')
const writePkg = require('../../lib/write-pkg')

const CWD = process.cwd()

module.exports = async function push (options = {}) {
  await throwIf.experience('qubit push')
  const pkg = await getPkg()
  const { propertyId } = (pkg.meta || {})
  if (!propertyId) {
    return log.info('Nothing to push')
  }

  if (!options.force) {
    const revision = await preService.get(propertyId, 'draft')
    const remoteUpdatedAt = revision.updatedAt
    const localUpdatedAt = pkg.meta.remoteUpdatedAt

    if (remoteUpdatedAt !== localUpdatedAt) {
      const diffs = await getDiff.pre(CWD, propertyId, 'draft')
      if (diffs.length) {
        log.error(chalk.bold.red('Remote has changed!'))
        return logDiff(diffs)
      }
    }
  }

  log.info('Pushing draft...')
  const updatedRevision = await preService.set(propertyId, await readFiles(CWD))
  await writePkg(updatedRevision.packageJson)
  log.info('Pushed!')
}
