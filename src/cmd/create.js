const path = require('path')
const input = require('input')
const chalk = require('chalk')
const autocomplete = require('cli-autocomplete')
const experienceService = require('../services/experience')
const codeService = require('../services/code')
const suggest = require('../lib/suggest')
const experienceFilename = require('../lib/experience-filename')
const validControlSizes = require('../lib/valid-control-sizes')
const scaffold = require('../lib/scaffold')
const log = require('../lib/log')
const CWD = process.cwd()

module.exports = async function create () {
  try {
    const propertySuggestions = await suggest.getProperties()

    autocomplete('Select a property', (input) => {
      return Promise.resolve(suggest.filter(input, propertySuggestions))
    }).on('submit', createExperience)
  } catch (err) {
    log.error(err)
  }
}

async function createExperience (propertyId) {
  const name = clean(await input.text('What would you like to call your experience?', { default: 'Created by xp' }))
  const controlDecimal = await input.select('Select control size:', validControlSizes, { default: 0.5 })
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

function clean (str) {
  return str.trim()
}
