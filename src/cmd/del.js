const _ = require('lodash')
const input = require('input')
const log = require('../lib/log')
const suggest = require('../lib/suggest')
const scaffold = require('../lib/scaffold')
const getPkg = require('../lib/get-pkg')
const down = require('../services/down')
const variationService = require('../services/variation')
const experienceService = require('../services/experience')
let CWD = process.cwd()

module.exports = async function del () {
  try {
    const pkg = await getPkg()
    let propertyId = _.get(pkg, 'meta.propertyId')
    let experienceId = _.get(pkg, 'meta.experienceId')

    if (propertyId && experienceId) {
      const experience = await experienceService.get(experienceId)
      const variations = await variationService.getAll(experience.last_iteration_id)
      const variationChoices = _(variations).filter({ is_control: 0 }).map(v => ({ name: v.name, value: v.master_id }))

      if (variationChoices.length > 1) {
        const variationId = await input.select('Which variation would you like to delete?', variationChoices)
        const deletedVariation = await variationService.remove(propertyId, experienceId, variationId)
        if (deletedVariation) {
          log.info('Variation successfully deleted')
        } else {
          log.error('Variation could not be deleted')
        }
        const { files } = await down(experienceId)
        await scaffold(CWD, files, true, true)
      } else {
        log.warn('There are no variations to delete')
      }
    } else {
      // if the user is not in an xp experience folder, allow them to delete an experience
      propertyId = await suggest.property()
      if (!propertyId) return
      experienceId = await suggest.experience(propertyId)
      if (!experienceId) return
      const deletedExperience = await experienceService.remove(propertyId, experienceId)
      if (deletedExperience) {
        log.info('Experience successfully deleted')
      } else {
        log.error('Experience could not be deleted')
      }
    }
  } catch (err) {
    log.error(err)
  }
}
