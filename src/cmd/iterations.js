const { getPropertyAndExperienceIds, getIterationId } = require('../lib/get-resource-ids')
const { isId } = require('../lib/is-type')
const getPkg = require('../lib/get-pkg')
const pullExperience = require('../lib/pull-experience')
const CWD = process.cwd()

module.exports = async function iterations (propertyId, experienceId, iterationId) {
  const pkg = await getPkg()
  ;({ propertyId, experienceId } = await getPropertyAndExperienceIds(propertyId, experienceId, pkg) || {})

  // Choose an iteration
  if (!isId(iterationId)) iterationId = await getIterationId(experienceId)

  return pullExperience(CWD, propertyId, experienceId, iterationId)
}
