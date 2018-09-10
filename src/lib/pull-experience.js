const down = require('../services/down')
const scaffold = require('./scaffold')
const log = require('./log')
const commonCodeWarning = require('../lib/common-code-warning')
const cssCodeWarning = require('../lib/css-code-warning')
const ensureTemplateData = require('../lib/ensure-template-data')

module.exports = async function pullExperience (CWD, propertyId, experienceId) {
  const { files, experience } = await down(experienceId)
  log.info(`Pulling experience ${experienceId}: ${experience.name}`)
  if (experience.solution_id === 7) {
    throw new Error('qubit-cli does not support simple message experiences')
  }
  await commonCodeWarning(CWD)
  await cssCodeWarning(CWD)
  await ensureTemplateData(CWD)

  await scaffold(CWD, files, { removeExtraneous: true })
  log.info(`Experience pulled into current working directory`)
}
