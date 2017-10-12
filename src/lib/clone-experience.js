const path = require('path')
const down = require('../services/down')
const scaffold = require('./scaffold')
const log = require('./log')
const experienceFilename = require('./experience-filename')

module.exports = async function cloneExperience (CWD, propertyId, experienceId) {
  log.info('Cloning experience')
  const { experience, files } = await down(experienceId)
  const filename = experienceFilename(experience)
  const dest = path.join(CWD, filename)
  // shouldConfirm = true, shouldOverwrite = false, removeExtraneous = false
  await scaffold(dest, files, true, null, true)
  log.info(`Experience cloned into ${filename}`)
}
