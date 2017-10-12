const down = require('../services/down')
const scaffold = require('./scaffold')
const log = require('./log')

module.exports = async function pullExperience (CWD, propertyId, experienceId) {
  log.info('Pulling experience')
  const { files } = await down(experienceId)
  // shouldConfirm = true, shouldOverwrite = false, removeExtraneous = false
  await scaffold(CWD, files, true, null, true)
  log.info(`Experience pulled into current working directory`)
}
