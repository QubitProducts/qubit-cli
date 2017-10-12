const down = require('../services/down')
const scaffold = require('./scaffold')
const log = require('./log')

module.exports = async function pullExperience (CWD, propertyId, experienceId) {
  log.info('Pulling experience')
  const { files } = await down(experienceId)
  await scaffold(CWD, files, false, true)
  log.info(`Experience pulled into current working directory`)
}
