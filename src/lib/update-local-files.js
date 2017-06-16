const _ = require('lodash')
const fs = require('fs-promise')
const path = require('path')
const scaffold = require('../lib/scaffold')
const mergePkg = require('../lib/merge-pkg')
const codeService = require('../services/code')
let CWD = process.cwd()

module.exports = async function updateLocalFiles (propertyId, experienceId, variationName, filesToUpdate, pkg, options = {}) {
  let files = _.pick(await codeService.get(propertyId, experienceId), filesToUpdate)
  if (_.get(pkg, 'meta')) files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
  delete _.get(pkg, `meta.variations.${variationName}`)

  if (options.deleteFiles) {
    await Promise.all([
      fs.remove(path.join(CWD, `${variationName}.js`)),
      fs.remove(path.join(CWD, `${variationName}.css`))
    ])
  }
  await scaffold(CWD, files, false, options.removeExtraneous)
}
