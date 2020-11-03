const config = require('config')
const throwIf = require('../../lib/throw-if')
const getPkg = require('../../lib/get-pkg')
const log = require('../../lib/log')
let opn = require('opn')

module.exports = async function open (page = 'editor', options) {
  await throwIf.placement('open')
  const pkg = await getPkg()
  const { propertyId, placementId } = pkg.meta

  const url = `${config.services.app}/p/${propertyId}/atom/placements/${placementId}/create?step=editor&view=schema`
  log.info(`opening ${url}`)
  return opn(url)
}
