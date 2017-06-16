const _ = require('lodash')
const input = require('input')
const chalk = require('chalk')
const log = require('../lib/log')
const suggest = require('../lib/suggest')
const getPkg = require('../lib/get-pkg')
const updateLocalFiles = require('../lib/update-local-files')
const getVariationChoices = require('../lib/get-variation-choices')
const variationService = require('../services/variation')
const experienceService = require('../services/experience')

module.exports = async function del () {
  try {
    const pkg = await getPkg()
    let propertyId = _.get(pkg, 'meta.propertyId')
    let experienceId = _.get(pkg, 'meta.experienceId')

    if (propertyId && experienceId) {
      // if the user is in an xp experience folder, allow them to delete a variation
      const variations = await variationService.getAll(propertyId, experienceId)
      const variationChoices = getVariationChoices(variations)

      if (variationChoices.length > 1) {
        const variationId = await input.select('Which variation would you like to delete?', variationChoices)
        await deleteVariation(propertyId, experienceId, variationId, pkg)
      } else {
        log(chalk.green('There are no variations to delete'))
      }
    } else {
      // if the user is not in an xp experience folder, allow them to delete an experience
      propertyId = await suggest.property('Select a property to delete from')
      experienceId = await suggest.experience(propertyId)
      await deleteExperience(propertyId, experienceId)
    }
  } catch (err) {
    log.error(err)
  }
}

async function deleteVariation (propertyId, experienceId, variationId, pkg) {
  const deletedVariation = await variationService.remove(propertyId, experienceId, variationId)

  if (deletedVariation) {
    const variationName = `variation-${variationId}`
    await updateLocalFiles(propertyId, experienceId, variationName, ['package.json'], pkg, { removeExtraneous: false, deleteFiles: true })
    log(chalk.green('Variation successfully deleted'))
  }
}

async function deleteExperience (propertyId, experienceId) {
  const response = await experienceService.remove(propertyId, experienceId)
  const experienceDeleted = _.get(response, 'status') === 200

  if (experienceDeleted) {
    log(chalk.green('Experience successfully deleted'))
  } else {
    log(chalk.red('Experience could not be deleted'))
  }
}
