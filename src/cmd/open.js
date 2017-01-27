let getPkg = require('../lib/get-pkg')
let opn = require('opn')

module.exports = async function open () {
  const pkg = await getPkg()
  const { propertyId, experienceId } = pkg.meta
  const dashboardURL = `https://app.qubit.com/p/${propertyId}/experiences/${experienceId}`
  console.log(`Opening experience overview page: ${dashboardURL}`)
  opn(dashboardURL, { wait: false })
}
