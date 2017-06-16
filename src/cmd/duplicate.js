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
    const propertyId = _.get(pkg, 'meta.propertyId') || await suggest.property('Select a property to duplicate from')
    const experienceId = _.get(pkg, 'meta.experienceId') || await suggest.experience(propertyId)
    const variations = await variationService.getAll(propertyId, experienceId)
    const nextVariationNumber = Object.keys(variations).length
    const variationChoices = getVariationChoices(variations)
    const experienceChoice = { name: 'Entire experience', value: experienceId }
    const choices = [experienceChoice]

    if (pkg.meta) {
      choices.push(...variationChoices)
      const chosenId = await input.select('What would you like to duplicate?', choices)

      if (chosenId === experienceId) {
        await duplicateExperience(propertyId, experienceId)
      } else {
        await duplicateVariation(propertyId, experienceId, chosenId, nextVariationNumber, pkg)
      }
    } else {
      await duplicateExperience(propertyId, experienceId)
    }
  } catch (err) {
    log.error(err)
  }
}

async function duplicateVariation (propertyId, experienceId, variationId, nextVariationNumber, pkg) {
  const variation = await variationService.get(propertyId, experienceId, variationId)
  const defaultName = `Variation ${nextVariationNumber}`
  const code = await variationService.getCode(variation)

  delete variation.id
  delete variation.master_id

  variation.name = await input.text('What do you want to call this variation?', { default: defaultName })
  variation.execution_code = code[`variation-${variationId}.js`]
  variation.custom_styles = code[`variation-${variationId}.css`]

  const newVariation = await variationService.create(propertyId, experienceId, variation)
  const fileName = variationService.getFilename(newVariation)
  let files = _.pick(await codeService.get(propertyId, experienceId), ['package.json', `${fileName}.js`, `${fileName}.css`])

  delete pkg.meta.variations[fileName]

  if (_.get(pkg, 'meta')) files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
  await scaffold(cwd, files, false, false)
}

async function duplicateExperience (propertyId, experienceId) {
  const experience = await experienceService.get(propertyId, experienceId)
  const targetPropertyId = await suggest.property('Select a property to duplciate the experience to')
  const name = await input.text('What do you want to call this experience?', { default: `${experience.name} (copy)` })
  const previewUrl = _.get(experience, 'recent_iterations.draft.url')
  const duplicateOptions = { id: experienceId, name, previewUrl, targetPropertyId }
  const duplicatedExperience = await experienceService.duplicate(propertyId, duplicateOptions)

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
