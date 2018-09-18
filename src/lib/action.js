const log = require('../lib/log')
const experienceService = require('../services/experience')
const templateService = require('../services/templates')
const experienceStatus = require('../lib/experience-status')

module.exports = async function action (propertyId, experienceId, action) {
  try {
    const experience = await experienceService.get(experienceId)
    if (experience.is_template) {
      if (action === 'publish') {
        await templateService.publish(experienceId)
      } else {
        throw new Error(`You cannot ${action} a template`)
      }
    } else {
      const updatedExperience = await experienceService[action](propertyId, experienceId)
      if (updatedExperience) {
        await experienceStatus(propertyId, experienceId)
      }
    }
  } catch (err) {
    log.error(err)
  }
}
