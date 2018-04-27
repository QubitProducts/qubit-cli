const _ = require('lodash')
const path = require('path')
const fs = require('fs-extra')
const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const scaffold = require('../lib/scaffold')
const down = require('../services/down')
const variationService = require('../services/variation')
const variationFileName = require('../lib/variation-name')
const experienceService = require('../services/experience')
const { STYLE_EXTENSION } = require('../constants')
const CWD = process.cwd()

module.exports = async function duplicateVariation () {
  try {
    const pkg = await getPkg()
    const experienceId = _.get(pkg, 'meta.experienceId')
    if (!experienceId) return log.warn(`You must be inside an experience folder in order to use this feature!`)
    const experience = await experienceService.get(experienceId)
    const iterationId = experience.last_iteration_id
    const variations = await variationService.getAll(iterationId)
    const code = await variationService.getCode(_.last(variations))
    let variation = _.last(variations)
    let newVariation = _.omit(variation, ['id', 'master_id'])

    newVariation.name = `Variation ${variations.length}`
    newVariation.execution_code = code[variationFileName(variation) + '.js']
    newVariation.custom_styles = code[variationFileName(variation) + STYLE_EXTENSION]

    await variationService.create(iterationId, newVariation)
    let { files } = await down(experienceId)
    await fs.outputFile(path.join(CWD, 'package.json'), files['package.json'])
    await scaffold(CWD, files, false, false, false)
  } catch (err) {
    log.error(err)
  }
}
