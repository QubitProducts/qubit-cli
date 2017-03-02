const _ = require('lodash')
const log = require('../lib/log')
const codeService = require('../services/code')
const readFiles = require('../lib/read-files')
const getPkg = require('../lib/get-pkg')
const mergePkg = require('../lib/merge-pkg')
const scaffold = require('../lib/scaffold')
const down = require('../services/down')
const pkgService = require('../services/pkg')
const diff = require('./diff')
const chalk = require('chalk')
let CWD = process.cwd()

module.exports = async function push (options) {
  const pkg = await getPkg()
  const {propertyId, experienceId} = (pkg.meta || {})
  if (!propertyId || !experienceId) return log('nothing to push')

  if (!options.force) {
    let { files } = await down(propertyId, experienceId)

    let remotePkg = JSON.parse(files['package.json'])
    let remoteExperienceUpdatedAt = remotePkg.meta.remoteUpdatedAt
    let remoteVariantsUpdatedAt = _.map(remotePkg.meta.variations, v => v.remoteUpdatedAt)
    let remoteUpdatedAts = [remoteExperienceUpdatedAt].concat(remoteVariantsUpdatedAt)

    let localExperienceUpdatedAt = pkg.meta.remoteUpdatedAt
    let localVariantsUpdatedAt = _.map(pkg.meta.variations, v => v.remoteUpdatedAt)
    let localUpdatedAts = [localExperienceUpdatedAt].concat(localVariantsUpdatedAt)

    if (remoteUpdatedAts.join('|') !== localUpdatedAts.join('|')) {
      log(chalk.yellow('Remote has changed since the last xp interaction!'))
      await diff(propertyId, experienceId)
      return
    }
  }

  log('pushing...')
  let { experience, variations } = await codeService.set(propertyId, experienceId, await readFiles(CWD))
  let files = pkgService.getCode(experience, variations)
  files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
  await scaffold(CWD, files, false, false)
  log('pushed!')
}
