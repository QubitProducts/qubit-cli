const _ = require('lodash')
const {getPropertyAndExperienceIds} = require('../lib/getPropertyAndExperienceIds')
const template = require('./template')
const getPkg = require('../lib/get-pkg')
const log = require('../lib/log')
const {isName} = require('../lib/is-type')
const pullExperience = require('../lib/pull-experience')
const CWD = process.cwd()

module.exports = async function pull (urlOrPidOrName, pidOrEid) {
  try {
    // from template?
    if (isName(urlOrPidOrName)) { return template(urlOrPidOrName) }

    // Pulling from an id-pair?
    let propertyId, experienceId
    const pkg = await getPkg()
    if (pkg.meta) {
      // Get ids from package.json?
      ;({propertyId, experienceId} = _.get(pkg, 'meta') || {})
      log.info(`Using property-id and experience-id from package.json`)
    } else {
      // Get ids from the user?
      ;({propertyId, experienceId} = await getPropertyAndExperienceIds(urlOrPidOrName, pidOrEid) || {})
    }

    // Do or abort
    if (propertyId && experienceId) {
      await pullExperience(CWD, propertyId, experienceId)
    } else {
      log.warn(`Aborted`)
    }
  } catch (err) {
    log.error(err)
  }
}
