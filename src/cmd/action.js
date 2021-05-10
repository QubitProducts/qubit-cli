const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const action = require('../lib/action')
const updatePkg = require('../lib/update-pkg')
const throwIf = require('../lib/throw-if')

module.exports = async function experienceAction (cmd) {
  if (cmd === 'publish') {
    await throwIf.experience('publish')
  }
  const pkg = await getPkg()
  if (!pkg.meta) { return log.warn('Navigate to an experience directory and try again') }
  const { propertyId, experienceId } = pkg.meta
  await action(propertyId, experienceId, cmd._name)
  return updatePkg(experienceId)
}
