const path = require('path')
const chalk = require('chalk')
const experienceService = require('../services/experience')
const codeService = require('../services/code')
const experienceFilename = require('./experience-filename')
const scaffold = require('./scaffold')
const log = require('./log')

module.exports = async function createExperience (CWD, propertyId, name, controlDecimal) {
  const recentIterations = buildRecentIterations(controlDecimal)
  const experience = await experienceService.create({ propertyId, name, recent_iterations: recentIterations })

  if (!experience.id) return log(`I'm afraid we could not create an experience at this time`)
  log(chalk.yellow('Creating experience'))

  const files = await codeService.get(propertyId, experience.id)
  const filename = experienceFilename(experience)
  const dest = path.join(CWD, filename)

  await scaffold(dest, files, false)
  log(chalk.green(`Created at ${filename}`))
}

function buildRecentIterations (controlDecimal) {
  return { 'draft': { 'control_size': controlDecimal } }
}
