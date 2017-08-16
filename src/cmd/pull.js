const _ = require('lodash')
const getPropertyAndExperienceIds = require('../lib/getPropertyAndExperienceIds')
const template = require('./template')
const down = require('../services/down')
const getPkg = require('../lib/get-pkg')
const scaffold = require('../lib/scaffold')
const mergePkg = require('../lib/merge-pkg')
const log = require('../lib/log')
const {isName} = require('../lib/is-type')
const CWD = process.cwd()

module.exports = async function pull (urlOrPidOrName, pidOrEid) {
  try {
    // Scaffold from template?
    if (isName(urlOrPidOrName)) { return template(urlOrPidOrName) }

    // We're pulling from a given id-pair.
    let propertyId, experienceId
    const pkg = await getPkg()
    if (pkg.meta) {
      // Get ids from package.json?
      ;({propertyId, experienceId} = _.get(pkg, 'meta') || {})
      log(`using property-id and experience-id from package.json`)
    } else {
      // Get ids from the user?
      ;({propertyId, experienceId} = await getPropertyAndExperienceIds(urlOrPidOrName, pidOrEid) || {})
    }

    if (!propertyId || !experienceId) {
      log(`aborted`)
      return
    }

    log(`pulling experience`)

    let {files} = await down(propertyId, experienceId)
    if (pkg.meta) files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
    await scaffold(CWD, files, false, true)

    log(`experience pulled`)
  } catch (err) {
    log.error(err)
  }
}
