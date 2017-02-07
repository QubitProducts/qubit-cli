const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
let opn = require('opn')

module.exports = async function open () {
  const pkg = (await getPkg().catch()) || {}
  pkg.meta = pkg.meta || {}
  const { propertyId, experienceId } = pkg.meta
  if (!propertyId || !experienceId) {
    log(`sorry! this feature assumes you have already setup an experience locally`)
    return log(`it uses the package.json metadata to open the overview page for an existing experience`)
  }
  const dashboardURL = `https://app.qubit.com/p/${propertyId}/experiences/${experienceId}`
  console.log(`Opening experience overview page: ${dashboardURL}`)
  opn(dashboardURL, { wait: false })
}
