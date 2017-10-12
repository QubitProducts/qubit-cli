const _ = require('lodash')
const path = require('path')
const input = require('input')
const fs = require('fs-extra')
const log = require('../lib/log')
const suggest = require('../lib/suggest')
const getPkg = require('../lib/get-pkg')
const scaffold = require('../lib/scaffold')
const cloneExperience = require('../lib/clone-experience')
const down = require('../services/down')
const variationService = require('../services/variation')
const iterationService = require('../services/iteration')
const experienceService = require('../services/experience')
const CWD = process.cwd()

module.exports = async function duplicate () {
  try {
    const pkg = await getPkg()
    const propertyId = _.get(pkg, 'meta.propertyId')
    const experienceId = _.get(pkg, 'meta.experienceId')

    if (propertyId && experienceId) {
      const experience = await experienceService.get(experienceId)
      const iterationId = experience.last_iteration_id

      // if the user is in an xp experience folder, allow them to duplicate a variation
      const variations = await variationService.getAll(iterationId)
      const nextVariationNumber = Object.keys(variations).length
      const variationChoices = _(variations).filter({ is_control: false }).map(v => ({ name: v.name, value: v.master_id })).value()

      if (variationChoices.length > 1) {
        const variationId = await input.select('Which variation would you like to duplicate?', variationChoices)
        await duplicateVariation(propertyId, experienceId, variationId, nextVariationNumber, pkg)
      } else {
        const { name, value: variationId } = variationChoices[0]
        const shouldDuplicateVariation = await input.confirm(`Do you want to duplicate ${name}?`)

        if (shouldDuplicateVariation) await duplicateVariation(propertyId, experienceId, variationId, nextVariationNumber, pkg)
      }
    } else {
      // if the user is not in an xp experience folder, allow them to duplicate an experience
      const selectedPropertyId = await suggest.property('What property would you like to duplicate from?')
      if (!selectedPropertyId) return
      const selectedExperienceId = await suggest.experience(selectedPropertyId)
      if (!selectedExperienceId) return
      const selectedExperience = await experienceService.get(selectedExperienceId)
      await duplicateExperience(selectedExperience)
    }
  } catch (err) {
    log.error(err)
  }
}

async function duplicateVariation (propertyId, experienceId, variationId, nextVariationNumber, pkg) {
  const variation = await variationService.get(variationId)
  const iterationId = variation.iteration_id
  const defaultName = `Variation ${nextVariationNumber}`
  const code = await variationService.getCode(variation)

  delete variation.id
  delete variation.master_id

  variation.name = await input.text('What do you want to call this variation?', { default: defaultName })
  variation.execution_code = code[`variation-${variationId}.js`]
  variation.custom_styles = code[`variation-${variationId}.css`]

  await variationService.create(iterationId, variation)
  let { files } = await down(experienceId)
  await fs.outputFile(path.join(CWD, 'package.json'), files['package.json'])
  await scaffold(CWD, files, false, false, false)
}

async function duplicateExperience (experience) {
  const experienceId = experience.id
  const iterationId = experience.last_iteration_id
  const iteration = await iterationService.get(iterationId)
  const targetPropertyId = await suggest.property('What property would you like to duplicate to?')
  if (!targetPropertyId) return
  const name = await input.text('What do you want to call this experience?', { default: `${experience.name} (copy)` })
  const previewUrl = iteration.url
  const duplicateOptions = { id: experienceId, name, preview_url: previewUrl, target_property_id: targetPropertyId }
  const duplicatedExperience = await experienceService.duplicate(experienceId, duplicateOptions)

  if (duplicatedExperience) {
    log.info('Experience successfully duplicated')
    const shouldClone = await input.confirm('Do you want to clone the duplicated experience into the current directory?')
    if (shouldClone) await cloneExperience(CWD, targetPropertyId, duplicatedExperience.id)
  } else {
    log.warn('Experience could not be duplicated')
  }
}
