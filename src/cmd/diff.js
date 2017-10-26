const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const checkDiff = require('../lib/check-diff')
let CWD = process.cwd()

module.exports = async function diff () {
  try {
    const pkg = await getPkg()
    const { propertyId, experienceId } = pkg.meta
    await checkDiff(CWD, propertyId, experienceId)
  } catch (err) {
    log.error(err)
  }
}
