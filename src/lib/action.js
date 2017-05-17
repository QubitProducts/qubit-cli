const log = require('../lib/log')
const experienceService = require('../services/experience')
const experienceStatus = require('../lib/experience-status')

module.exports = async function action (propertyId, experienceId, action) {
  try {
    const updatedExperience = await experienceService[action](propertyId, experienceId)

    if (updatedExperience) {
      await experienceStatus(propertyId, experienceId)
    }
  } catch (err) {
    log.error(err)
  }
}
