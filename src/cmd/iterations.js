const { getPropertyAndExperienceIds, getIterationId } = require('../lib/get-resource-ids')
const { isId } = require('../lib/is-type')
const getPkg = require('../lib/get-pkg')
const pullExperience = require('../lib/pull-experience')
const push = require('./push')
const confirmer = require('confirmer')
const CWD = process.cwd()

module.exports = async function iterations (propertyId, experienceId, iterationId) {
  const pkg = await getPkg()
  ;({ propertyId, experienceId } = await getPropertyAndExperienceIds(propertyId, experienceId, pkg) || {})

  // Choose an iteration
  if (!isId(iterationId)) iterationId = await getIterationId(experienceId)

  if (await confirmer(`This command may overwrite your current work, would you like to push first? (y/n)`)) {
    await push()
  }

  return pullExperience(CWD, propertyId, experienceId, iterationId)
}
