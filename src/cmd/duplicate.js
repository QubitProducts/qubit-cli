const _ = require('lodash')
const sillyname = require('sillyname')
const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const variationService = require('../services/variation')
const codeService = require('../services/code')
const pickVariation = require('../lib/pick-variation')
const scaffold = require('../lib/scaffold')
const fs = require('fs-promise')
const mergePkg = require('../lib/merge-pkg')
let CWD = process.cwd()

module.exports = async function duplicate () {
  try {
    const pkg = await getPkg()
    const {propertyId, experienceId} = pkg.meta
    const variations = pkg.meta.variations
    const variationKey = pickVariation(Object.keys(variations).map(v => `${v}.js`)).replace('.js', '')
    const variation = await variationService.get(propertyId, experienceId, variations[variationKey].variationId)
    delete variation.id
    delete variation.master_id
    variation.name = `${sillyname().toLowerCase().replace(/[^\w]/gi, '-')}`
    variation.execution_code = String(await fs.readFile(`${CWD}/${variationKey}.js`))
    variation.custom_styles = String(await fs.readFile(`${CWD}/${variationKey}.css`))
    const newVariation = await variationService.create(propertyId, experienceId, variation)
    const fileName = variationService.getFilename(newVariation)
    let files = _.pick(await codeService.get(propertyId, experienceId), ['package.json', `${fileName}.js`, `${fileName}.css`])
    delete pkg.meta.variations[fileName]
    if (_.get(pkg, 'meta')) files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
    await scaffold(CWD, files, false, false)
  } catch (err) {
    log.error(err)
  }
}
