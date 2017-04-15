const path = require('path')
const chalk = require('chalk')
const autocomplete = require('cli-autocomplete')
const down = require('../services/down')
const scaffold = require('../lib/scaffold')
const log = require('../lib/log')
const suggest = require('../lib/suggest')
const experienceFilename = require('../lib/experience-filename')
const CWD = process.cwd()

module.exports = async function clone () {
  try {
    const propertySuggestions = await suggest.getProperties()

    if (propertySuggestions.length === 1) {
      selectExperience(propertySuggestions[0].id)
    } else {
      autocomplete('Select a property', (input) => {
        return suggest.filter(input, propertySuggestions)
      }).on('submit', selectExperience)
    }
  } catch (err) {
    log.error(err)
  }
}

async function selectExperience (propertyId) {
  const experienceSuggestions = await suggest.getExperiences(propertyId)

  autocomplete('Select an experience', (input) => {
    return suggest.filter(input, experienceSuggestions)
  }).on('submit', (experienceId) => {
    cloneExperience(propertyId, experienceId)
  })
}

async function cloneExperience (propertyId, experienceId) {
  const { experience, files } = await down(propertyId, experienceId)
  const filename = experienceFilename(experience)
  const dest = path.join(CWD, filename)

  log(chalk.yellow('Cloning experience'))
  await scaffold(dest, files, false, true)
  log(chalk.green(`Cloned into ${filename}`))
}
