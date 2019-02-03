const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const getChanges = require('../lib/get-changes')
const logDiff = require('../lib/log-diff')
let CWD = process.cwd()

module.exports = async function changes () {
  const pkg = await getPkg()
  const { propertyId, experienceId } = pkg.meta
  let diffs = await getChanges(CWD, propertyId, experienceId)
  if (diffs.length) {
    logDiff(diffs)
  } else {
    log.info('Both versions are the same!')
  }
}
