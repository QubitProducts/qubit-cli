const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const up = require('./up')

module.exports = async function push () {
  const pkg = await getPkg().catch()
  if (!pkg) return log('nothing to push')
  const {propertyId, experienceId} = pkg.meta
  await up(propertyId, experienceId)
}
