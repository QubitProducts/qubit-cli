const experienceService = require('./experience')
const iterationService = require('./iteration')
const variationService = require('./variation')
const codeService = require('./code')

module.exports = async function down (experienceId) {
  const experience = await experienceService.get(experienceId)
  const iteration = await iterationService.get(experience.last_iteration_id)
  const variations = await variationService.getAll(experience.last_iteration_id)
  const files = codeService.getCode(experience, iteration, variations)
  return { experience, variations, files }
}
