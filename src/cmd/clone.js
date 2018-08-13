const {getPropertyAndExperienceIds} = require('../lib/get-property-and-experience-ids')
const cloneExperience = require('../lib/clone-experience')
const CWD = process.cwd()
const log = require('../lib/log')

module.exports = async function clone (urlOrPid, pidOrEid) {
  const { propertyId, experienceId } = await getPropertyAndExperienceIds(urlOrPid, pidOrEid) || {}
  if (!propertyId || !experienceId) {
    log.info(`PropertyId not found, are you in an experience folder?`)
    return
  }
  await cloneExperience(CWD, propertyId, experienceId)
}
