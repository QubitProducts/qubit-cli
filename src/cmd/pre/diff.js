const throwIf = require('../../lib/throw-if')
const getPkg = require('../../lib/get-pkg')
const getDiff = require('../../lib/get-diff')
const log = require('../../lib/log')
const logDiff = require('../../lib/log-diff')

const CWD = process.cwd()
const VALID_REVISIONS = ['live', 'draft']

module.exports = async function diff (revisionType = 'draft') {
  if (!VALID_REVISIONS.includes(revisionType)) {
    throw new Error(`'${revisionType}' is not a valid revision`)
  }
  await throwIf.experience('qubit diff')
  const pkg = await getPkg()
  const { propertyId } = pkg.meta
  const diffs = await getDiff.pre(CWD, propertyId, revisionType)
  if (diffs.length) {
    logDiff(diffs)
  } else {
    log.info(`No code has changed between your local environment and the remote ${revisionType} revision`)
  }
}
