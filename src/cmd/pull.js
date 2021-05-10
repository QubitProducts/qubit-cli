const getPkg = require('../lib/get-pkg')
const pullExperience = require('../lib/pull-experience')
const { getPropertyAndExperienceIds } = require('../lib/get-resource-ids')
const throwIf = require('../lib/throw-if')
const CWD = process.cwd()

module.exports = async function pull (propertyId, experienceId) {
  await throwIf.experience('pull')
  const pkg = await getPkg()
  ;({ propertyId, experienceId } =
    (await getPropertyAndExperienceIds(propertyId, experienceId, pkg)) || {})

  return pullExperience(CWD, propertyId, experienceId)
}
