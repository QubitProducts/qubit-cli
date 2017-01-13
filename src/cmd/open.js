let getPkg = require('../lib/get-pkg')
let spawn = require('child_process').spawn

module.exports = async function open () {
  const pkg = await getPkg()
  const { propertyId, experienceId } = pkg.meta
  spawn('open', [`https://app.qubit.com/p/${propertyId}/experiences/${experienceId}`])
}
