const experienceService = require('./experience')
const variationService = require('./variation')
const codeService = require('./code')

module.exports = async function down (propertyId, experienceId) {
  const experience = await experienceService.get(propertyId, experienceId)
  const variations = await variationService.getAll(experience.recent_iterations.draft.id)
  const files = codeService.getCode(experience, variations)
  return { experience, variations, files }
}
