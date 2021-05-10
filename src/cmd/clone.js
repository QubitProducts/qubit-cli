const { getPropertyAndExperienceIds } = require('../lib/get-resource-ids')
const getPkg = require('../lib/get-pkg')
const cloneExperience = require('../lib/clone-experience')
const throwIf = require('../lib/throw-if')
const CWD = process.cwd()

module.exports = async function clone (propertyId, experienceId) {
  await throwIf.none('clone')
  const pkg = await getPkg()
  ;({ propertyId, experienceId } =
    (await getPropertyAndExperienceIds(propertyId, experienceId, pkg)) || {})
  await cloneExperience(CWD, propertyId, experienceId)
}
