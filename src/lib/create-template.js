const path = require('path')
const templatesService = require('../services/templates')
const codeService = require('../services/code')
const experienceFilename = require('./experience-filename')
const scaffold = require('./scaffold')
const log = require('./log')

module.exports = async function createTemplate (CWD, propertyId, name, description) {
  log.info('Creating template')
  const template = await templatesService.create(propertyId, { name, description })
  const files = await codeService.get(propertyId, template.id, true)
  const filename = experienceFilename(template)
  const dest = path.join(CWD, filename)

  // shouldConfirm = true, shouldOverwrite = false, removeExtraneous = false
  await scaffold(dest, files, true, null, true)
  log.info(`Created at ${filename}`)
}
