const input = require('input')
const chalk = require('chalk')
const getPkg = require('../lib/get-pkg')
const experienceService = require('../services/experience')
const iterationService = require('../services/iteration')
const validControlSizes = require('../lib/valid-control-sizes')
const log = require('../lib/log')

module.exports = async function traffic (options) {
  try {
    const pkg = await getPkg()
    if (!pkg.meta) return log(chalk.red('Navigate to an experience directory and try again'))

    const {experienceId} = pkg.meta
    const { last_iteration_id: iterationId } = await experienceService.get(experienceId)
    const iteration = await iterationService.get(iterationId)
    const currentControlDecimal = iteration.control_size
    const currentControlPercentage = getControlPercentage(currentControlDecimal)

    if (options.view) return log(`Current control size is ${currentControlPercentage}`)

    const newControlDecimal = await input.select(`Select control size (current ${currentControlPercentage}):`, validControlSizes, { 'default': currentControlDecimal })
    const updatedIteration = await iterationService.set(iterationId, { control_size: newControlDecimal })

    if (updatedIteration) {
      log(chalk.green('Traffic split updated'))
    } else {
      log(chalk.red('Failed to update traffic split'))
    }
  } catch (err) {
    log.error(err)
  }
}

function getControlPercentage (controlValue) {
  return validControlSizes.find((iteree) => iteree.value === controlValue).name
}
