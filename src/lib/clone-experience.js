const path = require('path')
const chalk = require('chalk')
const down = require('../services/down')
const scaffold = require('./scaffold')
const log = require('./log')
const experienceFilename = require('./experience-filename')

module.exports = async function cloneExperience (CWD, propertyId, experienceId) {
  const { experience, files } = await down(propertyId, experienceId)
  const filename = experienceFilename(experience)
  const dest = path.join(CWD, filename)

  log(chalk.yellow('Cloning experience'))
  await scaffold(dest, files, false, true)
  log(chalk.green(`Cloned into ${filename}`))
}
