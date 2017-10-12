const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')
const log = require('../lib/log')
const codeService = require('../services/code')
const readFiles = require('../lib/read-files')
const getPkg = require('../lib/get-pkg')
const mergePkg = require('../lib/merge-pkg')
const scaffold = require('../lib/scaffold')
const down = require('../services/down')
const pkgService = require('../services/pkg')
const diff = require('./diff')
let CWD = process.cwd()

module.exports = async function push (options) {
  const pkg = await getPkg()
  const {propertyId, experienceId} = (pkg.meta || {})
  if (!propertyId || !experienceId) return log.info('Nothing to push')

  if (!options.force) {
    let { files } = await down(experienceId)

    let remotePkg = JSON.parse(files['package.json'])
    let remoteExperienceUpdatedAt = remotePkg.meta.remoteUpdatedAt
    let remoteVariantsUpdatedAt = _.map(remotePkg.meta.variations, v => v.remoteUpdatedAt)
    let remoteUpdatedAts = [remoteExperienceUpdatedAt].concat(remoteVariantsUpdatedAt)

    let localExperienceUpdatedAt = pkg.meta.remoteUpdatedAt
    let localVariantsUpdatedAt = _.map(pkg.meta.variations, v => v.remoteUpdatedAt)
    let localUpdatedAts = [localExperienceUpdatedAt].concat(localVariantsUpdatedAt)

    if (remoteUpdatedAts.join('|') !== localUpdatedAts.join('|')) {
      log.info('Remote has changed since the last interaction!')
      await diff()
    }
  }

  log.info('Pushing...')
  let { experience, iteration, variations } = await codeService.set(propertyId, experienceId, await readFiles(CWD))
  let files = pkgService.getCode(experience, iteration, variations)
  files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
  await fs.writeFile(path.join(CWD, 'package.json'), files['package.json'])
  await scaffold(CWD, files, false, false)
  log.info('Pushed!')
}
