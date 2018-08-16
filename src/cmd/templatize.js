const input = require('../lib/input')
const formatLog = require('../lib/format-log')
const log = require('../lib/log')
const { getPropertyAndExperienceIds } = require('../lib/get-property-and-experience-ids')
const templatizeExperience = require('../lib/templatize')
const CWD = process.cwd()

module.exports = async function templatize (urlOrPid, pidOrEid) {
  const { propertyId, experienceId } = await getPropertyAndExperienceIds(urlOrPid, pidOrEid) || {}
  if (!propertyId || !experienceId) {
    log.info(`PropertyId not found, are you in an experience folder?`)
    return
  }

  if (!experienceId) {
    log.info(`Experience id not entered or not found, are you in an experience folder?`)
    return
  }

  const template = {}
  template.name = await input.text(formatLog('   What would you like to call your template?'), {
    validate (name) {
      if (name.length > 2) return true
      return `Template names must be greater than 2 charachters long`
    }
  })

  template.description = await input.text(formatLog('   Please provide a description:'), {
    default: 'Template created from experience'
  })

  log.info(`creating template...`)
  const { id, property_id: propId } = await templatizeExperience(CWD, experienceId, template)
  log.info(`template created!`)
  log.info(`clone your template with this command:`)
  log.info(`qubit clone ${propId} ${id}`)
}
