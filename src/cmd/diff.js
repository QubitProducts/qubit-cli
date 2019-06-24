const { getPropertyAndExperienceIds, getIterationId } = require('../lib/get-resource-ids')
const { isId } = require('../lib/is-type')
const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const getDiff = require('../lib/get-diff')
const logDiff = require('../lib/log-diff')
const throwIf = require('../lib/throw-if')
let CWD = process.cwd()

module.exports = async function diff (propertyId, experienceId, iterationId) {
  await throwIf.pre('qubit pre diff')
  const pkg = await getPkg()
  ;({ propertyId, experienceId } = await getPropertyAndExperienceIds(propertyId, experienceId, pkg) || {})

  // Choose an iteration
  if (!isId(iterationId)) iterationId = await getIterationId(experienceId)

  let diffs = await getDiff.experience(CWD, propertyId, experienceId, iterationId)
  if (diffs.length) {
    logDiff(diffs)
  } else {
    log.info('No code has changed between these two iterations')
  }
}
