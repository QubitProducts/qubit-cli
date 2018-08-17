const path = require('path')
const experienceService = require('../services/experience')
const codeService = require('../services/code')
const { createExperienceFromTemplate } = require('../services/templates')
const experienceFilename = require('./experience-filename')
const scaffold = require('./scaffold')
const log = require('./log')

module.exports = async function createExperience (CWD, propertyId, name, controlDecimal, templateId) {
  const recentIterations = buildRecentIterations(controlDecimal)
  let experience
  if (templateId) {
    experience = await createExperienceFromTemplate(templateId, {
      name,
      description: 'Experience from template'
    })
  } else {
    experience = await experienceService.create({ propertyId, name, recent_iterations: recentIterations })
  }

  if (experience.solution_id === 7) {
    throw new Error('qubit-cli does not support simple message experiences')
  }
  log.info('Creating experience')

  const files = await codeService.get(propertyId, experience.id)
  const filename = experienceFilename(experience)
  const dest = path.join(CWD, filename)

  await scaffold(dest, files, { removeExtraneous: true })
  log.info(`Created at ${filename}`)
}

function buildRecentIterations (controlDecimal) {
  return { 'draft': { 'control_size': controlDecimal } }
}
