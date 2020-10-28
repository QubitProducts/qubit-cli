const throwIf = require('../../lib/throw-if')
const getPkg = require('../../lib/get-pkg')
const getDiff = require('../../lib/get-diff')
const isOneOf = require('../../lib/is-one-of')(['live', 'draft'])
const log = require('../../lib/log')
const logDiff = require('../../lib/log-diff')

const CWD = process.cwd()

module.exports = async function diff (revisionType = 'draft') {
  await throwIf.pre('diff')
  isOneOf(revisionType)
  const pkg = await getPkg()
  const { propertyId } = pkg.meta
  const diffs = await getDiff.pre(CWD, propertyId, revisionType)
  if (diffs.length) {
    logDiff(diffs)
  } else {
    log.info(`No code has changed between your local environment and the remote ${revisionType} revision`)
  }
}
