const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const up = require('./up')

module.exports = async function push () {
  try {
    const pkg = await getPkg()
    const {propertyId, experienceId} = pkg.meta
    await up(propertyId, experienceId)
  } catch (e) {
    log.error(e)
  }
}
