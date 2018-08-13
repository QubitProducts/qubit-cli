const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const action = require('../lib/action')
const updatePkg = require('../lib/update-pkg')

module.exports = async function experienceAction (cmd) {
  const pkg = await getPkg()
  if (!pkg.meta) return log.warn('Navigate to an experience directory and try again')
  const {propertyId, experienceId} = pkg.meta
  await action(propertyId, experienceId, cmd._name)
  return updatePkg(experienceId)
}
