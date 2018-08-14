const input = require('../lib/input')
const _ = require('lodash')
const getPkg = require('../lib/get-pkg')
const formatLog = require('../lib/format-log')
const log = require('../lib/log')
const templatizeExperience = require('../lib/templatize')
const CWD = process.cwd()

module.exports = async function templatize (experienceId) {
  const pkg = await getPkg()
  experienceId = experienceId || _.get(pkg, ['meta', 'experienceId'])
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
  const { id, property_id: propertyId } = await templatizeExperience(CWD, experienceId, template)
  log.info(`template created!`)
  log.info(`clone your template with this command:`)
  log.info(`qubit clone ${propertyId} ${id}`)
}
