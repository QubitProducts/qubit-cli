const path = require('path')
const chalk = require('chalk')
const down = require('../services/down')
const scaffold = require('../lib/scaffold')
const log = require('../lib/log')
const suggest = require('../lib/suggest')
const experienceFilename = require('../lib/experience-filename')
const CWD = process.cwd()

module.exports = async function clone () {
  try {
    suggest.property((propertyId) => {
      suggest.experience(propertyId, cloneExperience)
    })
  } catch (err) {
    log.error(err)
  }
}

async function cloneExperience (propertyId, experienceId) {
  const { experience, files } = await down(propertyId, experienceId)
  const filename = experienceFilename(experience)
  const dest = path.join(CWD, filename)

  log(chalk.yellow('Cloning experience'))
  await scaffold(dest, files, false, true)
  log(chalk.green(`Cloned into ${filename}`))
}
