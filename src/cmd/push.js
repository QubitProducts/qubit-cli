const _ = require('lodash')
const chalk = require('chalk')
const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const updatePkg = require('../lib/update-pkg')
const readFiles = require('../lib/read-files')
const globalCodeWarning = require('../lib/global-code-warning')
const commonCodeWarning = require('../lib/common-code-warning')
const cssCodeWarning = require('../lib/css-code-warning')
const codeService = require('../services/code')
const down = require('../services/down')
const getDiff = require('../lib/get-diff')
const logDiff = require('../lib/log-diff')
const throwIf = require('../lib/throw-if')
const CWD = process.cwd()

module.exports = async function push (options = {}) {
  await throwIf.experience('push')
  const pkg = await getPkg()
  const { propertyId, experienceId } = pkg.meta || {}
  if (!propertyId || !experienceId) return log.info('Nothing to push')

  await globalCodeWarning(CWD)
  await commonCodeWarning(CWD)
  await cssCodeWarning(CWD)

  if (!options.force) {
    const { files, experience } = await down(experienceId)
    if (experience.solution_id === 7) {
      throw new Error('qubit-cli does not support simple message experiences')
    }

    const remotePkg = JSON.parse(files['package.json'])
    const remoteExperienceUpdatedAt = remotePkg.meta.remoteUpdatedAt
    const remoteVariantsUpdatedAt = _.map(
      remotePkg.meta.variations,
      v => v.remoteUpdatedAt
    )
    const remoteUpdatedAts = [remoteExperienceUpdatedAt].concat(
      remoteVariantsUpdatedAt
    )

    const localExperienceUpdatedAt = pkg.meta.remoteUpdatedAt
    const localVariantsUpdatedAt = _.map(
      pkg.meta.variations,
      v => v.remoteUpdatedAt
    )
    const localUpdatedAts = [localExperienceUpdatedAt].concat(
      localVariantsUpdatedAt
    )

    if (remoteUpdatedAts.join('|') !== localUpdatedAts.join('|')) {
      const diffs = await getDiff.experience(CWD, propertyId, experienceId)
      if (diffs.length) {
        log.error(chalk.bold.red('Remote has changed!'))
        return logDiff(diffs)
      }
    }
  }

  log.info('Pushing...')
  await codeService.set(propertyId, experienceId, await readFiles(CWD))
  await updatePkg(experienceId)
  log.info('Pushed!')
}
