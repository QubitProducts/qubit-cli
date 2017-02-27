const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const checkDiff = require('./check-diff')

module.exports = async function compare (propertyId, experienceId) {
  try {
    const pkg = await getPkg()
    const {propertyId, experienceId} = pkg.meta
    await checkDiff(propertyId, experienceId)
  } catch (err) {
    log.error(err)
  }
}
