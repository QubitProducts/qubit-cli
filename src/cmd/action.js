const chalk = require('chalk')
const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const action = require('../lib/action')

module.exports = async function experienceAction (cmd) {
  try {
    const pkg = await getPkg()
    if (!pkg.meta) return log(chalk.red('Navigate to an experience directory and try again'))
    const {propertyId, experienceId} = pkg.meta
    await action(propertyId, experienceId, cmd._name)
  } catch (err) {
    log.error(err)
  }
}
