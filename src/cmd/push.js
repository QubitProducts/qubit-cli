const _ = require('lodash')
const chalk = require('chalk')
const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const updatePkg = require('../lib/update-pkg')
const readFiles = require('../lib/read-files')
const commonCodeWarning = require('../lib/common-code-warning')
const cssCodeWarning = require('../lib/css-code-warning')
const codeService = require('../services/code')
const down = require('../services/down')
const getDiff = require('../lib/get-diff')
const logDiff = require('../lib/log-diff')
let CWD = process.cwd()

module.exports = async function push (options = {}) {
  const pkg = await getPkg()
  const { propertyId, experienceId } = (pkg.meta || {})
  if (!propertyId || !experienceId) return log.info('Nothing to push')

  await commonCodeWarning(CWD)
  await cssCodeWarning(CWD)

  if (!options.force) {
    let { files, experience } = await down(experienceId)
    if (experience.solution_id === 7) {
      throw new Error('qubit-cli does not support simple message experiences')
    }

    let remotePkg = JSON.parse(files['package.json'])
    let remoteExperienceUpdatedAt = remotePkg.meta.remoteUpdatedAt
    let remoteVariantsUpdatedAt = _.map(remotePkg.meta.variations, v => v.remoteUpdatedAt)
    let remoteUpdatedAts = [remoteExperienceUpdatedAt].concat(remoteVariantsUpdatedAt)

    let localExperienceUpdatedAt = pkg.meta.remoteUpdatedAt
    let localVariantsUpdatedAt = _.map(pkg.meta.variations, v => v.remoteUpdatedAt)
    let localUpdatedAts = [localExperienceUpdatedAt].concat(localVariantsUpdatedAt)

    if (remoteUpdatedAts.join('|') !== localUpdatedAts.join('|')) {
      let diffs = await getDiff(CWD, propertyId, experienceId)
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
