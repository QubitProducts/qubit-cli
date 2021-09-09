const input = require('../lib/input')
const getPkg = require('../lib/get-pkg')
const experienceService = require('../services/experience')
const iterationService = require('../services/iteration')
const validControlSizes = require('../lib/valid-control-sizes')
const formatLog = require('../lib/format-log')
const updatePkg = require('../lib/update-pkg')
const log = require('../lib/log')

module.exports = async function traffic (options) {
  const pkg = await getPkg()
  if (!pkg.meta) {
    return log.warn('Navigate to an experience directory and try again')
  }

  const { experienceId } = pkg.meta
  const { last_iteration_id: iterationId } = await experienceService.get(
    experienceId
  )
  const iteration = await iterationService.get(iterationId)
  if (iteration.custom_traffic_split) {
    log.warn(
      'This experience has a custom traffic split. At present custom traffic splits can be only be updated from within the Qubit platform on the settings page of this experience.'
    )
  } else {
    const currentControlDecimal = iteration.control_size
    const currentControlPercentage = getControlPercentage(currentControlDecimal)

    if (options.view) {
      return log.info(`Current control size is ${currentControlPercentage}`)
    }
    const newControlDecimal = await input.select(
      formatLog(
        `   Select control size (current ${currentControlPercentage.trim()})`
      ),
      validControlSizes,
      { default: currentControlDecimal }
    )
    const updatedIteration = await iterationService.set(iterationId, {
      control_size: newControlDecimal
    })

    if (updatedIteration) {
      log.info('Traffic split updated')
      await updatePkg(experienceId)
    } else {
      log.warn('Failed to update traffic split')
    }
  }
}

function getControlPercentage (controlValue) {
  return validControlSizes.find(iteree => iteree.value === controlValue).name
}
