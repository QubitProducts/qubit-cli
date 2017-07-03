const log = require('../lib/log')
const suggest = require('../lib/suggest')
const cloneExperience = require('../lib/clone-experience')
const CWD = process.cwd()

module.exports = async function clone () {
  try {
    const propertyId = await suggest.property('Select a property')
    const experienceId = await suggest.experience(propertyId)
    await cloneExperience(CWD, propertyId, experienceId)
  } catch (err) {
    log.error(err)
  }
}
