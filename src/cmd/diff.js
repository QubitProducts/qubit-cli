const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const getDiff = require('../lib/get-diff')
const logDiff = require('../lib/log-diff')
let CWD = process.cwd()

module.exports = async function diff () {
  const pkg = await getPkg()
  const { propertyId, experienceId } = pkg.meta
  let diffs = await getDiff(CWD, propertyId, experienceId)
  if (diffs.length) {
    logDiff(diffs)
  } else {
    log.info('Both versions are the same!')
  }
}
