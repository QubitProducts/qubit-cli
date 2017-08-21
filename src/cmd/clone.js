const {getPropertyAndExperienceIds} = require('../lib/getPropertyAndExperienceIds')
const cloneExperience = require('../lib/clone-experience')
const CWD = process.cwd()
const log = require('../lib/log')

module.exports = async function clone (urlOrPid, pidOrEid) {
  try {
    const {propertyId, experienceId} = await getPropertyAndExperienceIds(urlOrPid, pidOrEid) || {}
    if (!propertyId || !experienceId) {
      log(`aborted`)
      return
    }
    await cloneExperience(CWD, propertyId, experienceId)
  } catch (err) {
    log.error(err)
  }
}
