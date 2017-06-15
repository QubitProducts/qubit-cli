const _ = require('lodash')
const chalk = require('chalk')
const input = require('input')
const log = require('../lib/log')
const fs = require('fs-promise')
const suggest = require('../lib/suggest')
const getPkg = require('../lib/get-pkg')
const scaffold = require('../lib/scaffold')
const mergePkg = require('../lib/merge-pkg')
const cloneExperience = require('../lib/clone-experience')
const variationService = require('../services/variation')
const codeService = require('../services/code')
const experienceService = require('../services/experience')
let CWD = process.cwd()

module.exports = async function duplicate () {
  try {
    const pkg = await getPkg()

    if (!pkg.meta) {
      await duplicateExperience()
    } else {
      const selectOptions = [
        { name: 'An experience', value: 'experience' },
        { name: 'A variation', value: 'variation' }
      ]
      const experienceOrVariation = await input.select('What would you like to duplicate?', selectOptions)

      if (experienceOrVariation === 'experience') {
        await duplicateExperience()
      } else {
        await duplicateVariation(pkg)
      }
    }
  } catch (err) {
    log.error(err)
  }
}

async function duplicateVariation (pkg) {
  const { propertyId, experienceId } = pkg.meta
  const variations = pkg.meta.variations
  const variationChoices = getVariationChoices(variations)
  let chosenVariationId

  if (variationChoices.length > 1) {
    chosenVariationId = await input.select('Which variation would you like to duplicate?', variationChoices)
  } else {
    chosenVariationId = variationChoices[0].value
  }

  const variation = await variationService.get(propertyId, experienceId, chosenVariationId)

  delete variation.id
  delete variation.master_id

  variation.name = `Variation ${Object.keys(variations).length}`
  variation.execution_code = String(await fs.readFile(`${CWD}/variation-${chosenVariationId}.js`))
  variation.custom_styles = String(await fs.readFile(`${CWD}/variation-${chosenVariationId}.css`))

  const newVariation = await variationService.create(propertyId, experienceId, variation)
  const fileName = variationService.getFilename(newVariation)
  let files = _.pick(await codeService.get(propertyId, experienceId), ['package.json', `${fileName}.js`, `${fileName}.css`])

  delete pkg.meta.variations[fileName]

  if (_.get(pkg, 'meta')) files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
  await scaffold(CWD, files, false, false)
}

async function duplicateExperience () {
  const propertyId = await suggest.property('Select a property')
  const experienceId = await suggest.experience(propertyId)
  const experience = await experienceService.get(propertyId, experienceId)
  const targetPropertyId = await suggest.property('Select a property to clone the experience to')
  const name = `${experience.name} (copy)`
  const previewUrl = _.get(experience, 'recent_iterations.draft.url')
  const duplicateOptions = { id: experienceId, name, previewUrl, targetPropertyId }
  const duplicatedExperience = await experienceService.duplicate(propertyId, duplicateOptions)

  if (duplicatedExperience) {
    log(chalk.green('Experience successfully duplicated'))
    const shouldClone = await input.confirm('Do you want to clone the experience into the current directory?')

    if (shouldClone) await cloneExperience(CWD, targetPropertyId, duplicatedExperience.id)
  } else {
    log(chalk.red('Experience could not be duplicated'))
  }
}

function getVariationChoices (variations) {
  const allVariations = Object.keys(variations).map((variation, index) => {
    return {
      name: `Variation ${index}`,
      value: Number(variation.match(/variation-(\d+)/i)[1]) // variationMasterId
    }
  })

  // return all variations apart from control
  return _.drop(allVariations, 1)
}
