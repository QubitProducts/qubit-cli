const chalk = require('chalk')
const log = require('../lib/log')
const experienceService = require('../services/experience')

module.exports = async function experienceStatus (propertyId, experienceId) {
  const experienceState = await experienceService.status(propertyId, experienceId)

  if (experienceState.processing) {
    log(chalk.yellow(`Experience is ${experienceState.state}`))

    setTimeout(() => {
      experienceStatus(propertyId, experienceId)
    }, 3000)
  } else {
    log(chalk.green(`Experience is ${experienceState.state}`))
  }
}
