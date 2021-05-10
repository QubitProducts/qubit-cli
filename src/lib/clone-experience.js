const path = require('path')
const down = require('../services/down')
const scaffold = require('./scaffold')
const log = require('./log')
const experienceFilename = require('./experience-filename')

module.exports = async function cloneExperience (
  CWD,
  propertyId,
  experienceId
) {
  const { experience, files } = await down(experienceId)
  log.info(`Cloning ${experienceId} ${experience.name}`)
  if (experience.solution_id === 7) {
    throw new Error('qubit-cli does not support simple message experiences')
  }
  const filename = experienceFilename(experience)
  const dest = path.join(CWD, filename)
  await scaffold(dest, files, { removeExtraneous: true })
  log.info(`Cloned into ${filename}`)
}
