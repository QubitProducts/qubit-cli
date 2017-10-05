const _ = require('lodash')
const chalk = require('chalk')
const input = require('input')
const log = require('../lib/log')
const suggest = require('../lib/suggest')
const getPkg = require('../lib/get-pkg')
const scaffold = require('../lib/scaffold')
const mergePkg = require('../lib/merge-pkg')
const cloneExperience = require('../lib/clone-experience')
const variationService = require('../services/variation')
const codeService = require('../services/code')
const experienceService = require('../services/experience')
const cwd = process.cwd()

module.exports = async function duplicate () {
  try {
    const pkg = await getPkg()
    let propertyId = _.get(pkg, 'meta.propertyId')
    let experienceId = _.get(pkg, 'meta.experienceId')
    let iterationId = _.get(pkg, 'meta.iterationId')

    if (propertyId && experienceId) {
      // if the user is in an xp experience folder, allow them to duplicate a variation
      const experience = await experienceService.get(propertyId, experienceId)
      const variations = await variationService.getAll(experience.recent_iterations.draft.id)
      const nextVariationNumber = Object.keys(variations).length
      const variationChoices = getVariationChoices(variations)

      if (variationChoices.length > 1) {
        const variationId = await input.select('Which variation would you like to duplicate?', variationChoices)
        await duplicateVariation(propertyId, experienceId, iterationId, variationId, nextVariationNumber, pkg)
      } else {
        const { name, value: variationId } = variationChoices[0]
        const shouldDuplicateVariation = await input.confirm(`Do you want to duplicate ${name}?`)

        if (shouldDuplicateVariation) await duplicateVariation(propertyId, experienceId, variationId, nextVariationNumber, pkg)
      }
    } else {
      // if the user is not in an xp experience folder, allow them to duplicate an experience
      propertyId = await suggest.property('Select a property to duplicate from')
      experienceId = await suggest.experience(propertyId)

      await duplicateExperience(propertyId, experienceId)
    }
  } catch (err) {
    log.error(err)
  }
}

async function duplicateVariation (propertyId, experienceId, iterationId, variationId, nextVariationNumber, pkg) {
  const variation = await variationService.get(variationId)
  const defaultName = `Variation ${nextVariationNumber}`
  const code = await variationService.getCode(variation)

  delete variation.id
  delete variation.master_id

  variation.name = await input.text('What do you want to call this variation?', { default: defaultName })
  variation.execution_code = code[`variation-${variationId}.js`]
  variation.custom_styles = code[`variation-${variationId}.css`]

  const newVariation = await variationService.create(iterationId)
  const fileName = variationService.getFilename(newVariation)
  let files = _.pick(await codeService.get(propertyId, experienceId), ['package.json', `${fileName}.js`, `${fileName}.css`])

  // delete pkg.meta.variations[fileName]
  delete _.get(pkg, `meta.variations.${fileName}`)

  if (_.get(pkg, 'meta')) files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
  await scaffold(cwd, files, false, false)
}

async function duplicateExperience (propertyId, experienceId) {
  const experience = await experienceService.get(propertyId, experienceId)
  const targetPropertyId = await suggest.property('Select a property to duplciate the experience to')
  const name = await input.text('What do you want to call this experience?', { default: `${experience.name} (copy)` })
  const previewUrl = _.get(experience, 'recent_iterations.draft.url')
  const duplicateOptions = { id: experienceId, name, preview_url: previewUrl, target_property_id: targetPropertyId }
  const duplicatedExperience = await experienceService.duplicate(experienceId, duplicateOptions)

  if (duplicatedExperience) {
    log(chalk.green('Experience successfully duplicated'))
    const shouldClone = await input.confirm('Do you want to clone the duplicated experience into the current directory?')

    if (shouldClone) await cloneExperience(cwd, targetPropertyId, duplicatedExperience.id)
  } else {
    log(chalk.red('Experience could not be duplicated'))
  }
}

function getVariationChoices (variations) {
  const controlKey = Object.keys(variations)[0]
  const allVariations = _.omit(variations, controlKey)

  return _.map(allVariations, variation => {
    return {
      name: variation.name,
      value: variation.master_id
    }
  })
}
