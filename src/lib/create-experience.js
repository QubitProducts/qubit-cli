const path = require('path')
const experienceService = require('../services/experience')
const codeService = require('../services/code')
const experienceFilename = require('./experience-filename')
const scaffold = require('./scaffold')
const log = require('./log')

module.exports = async function createExperience (CWD, propertyId, name, controlDecimal) {
  const recentIterations = buildRecentIterations(controlDecimal)
  const experience = await experienceService.create({ propertyId, name, recent_iterations: recentIterations })

  if (experience.solution_id === 7) {
    throw new Error('qubit-cli does not support simple message experiences')
  }
  log.info('Creating experience')

  const files = await codeService.get(propertyId, experience.id)
  const filename = experienceFilename(experience)
  const dest = path.join(CWD, filename)

  // shouldConfirm = true, shouldOverwrite = false, removeExtraneous = false
  await scaffold(dest, files, true, null, true)
  log.info(`Created at ${filename}`)
}

function buildRecentIterations (controlDecimal) {
  return { 'draft': { 'control_size': controlDecimal } }
}
