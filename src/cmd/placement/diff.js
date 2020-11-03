const throwIf = require('../../lib/throw-if')
const getPkg = require('../../lib/get-pkg')
const getDiff = require('../../lib/get-diff')
const isOneOf = require('../../lib/is-one-of')(['active', 'draft'])
const log = require('../../lib/log')
const logDiff = require('../../lib/log-diff')

const CWD = process.cwd()

module.exports = async function diff (implementationType = 'draft') {
  await throwIf.placement('diff')
  isOneOf(implementationType)
  const pkg = await getPkg()
  const { propertyId, placementId } = pkg.meta
  const diffs = await getDiff.placement(CWD, propertyId, placementId, implementationType)
  if (diffs.length) {
    logDiff(diffs)
  } else {
    log.info(`No code has changed between your local environment and remote`)
  }
}
