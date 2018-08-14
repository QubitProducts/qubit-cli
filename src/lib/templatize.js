const templatesService = require('../services/templates')
const log = require('./log')
// template = { name, description }

module.exports = async function templatize (CWD, experienceId, template) {
  log.info('Creating template from experience')
  return templatesService.createTemplateFromExperience(experienceId, template)
}
