const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const up = require('./up')

module.exports = async function push () {
  const pkg = await getPkg()
  const {propertyId, experienceId} = (pkg.meta || {})
  if (!propertyId || !experienceId) return log('nothing to push')
  await up(propertyId, experienceId)
}
