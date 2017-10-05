const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const checkDiff = require('./check-diff')

module.exports = async function diff () {
  try {
    const pkg = await getPkg()
    const { propertyId, experienceId, iterationId } = pkg.meta
    await checkDiff(propertyId, experienceId, iterationId)
  } catch (err) {
    log.error(err)
  }
}
