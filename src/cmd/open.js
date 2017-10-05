const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
let opn = require('opn')

module.exports = async function open (options) {
  const pkg = await getPkg()
  pkg.meta = pkg.meta || {}
  const { propertyId, experienceId, iterationId } = pkg.meta

  if (!propertyId || !experienceId || !iterationId) {
    log(`sorry! this feature assumes you have already setup an experience locally`)
    return log(`it uses the package.json metadata to open the overview page for an existing experience`)
  }

  let route = ''

  if (options.editor) route = 'editor'
  if (options.settings) route = 'settings'

  const appUrl = `https://app.qubit.com/p/${propertyId}/experiences/${experienceId}/${route}`
  log(`Opening app ${route || 'overview'} page: ${appUrl}`)
  opn(appUrl, { wait: false })
}
