const input = require('../lib/input')
const createExperience = require('../lib/create-experience')
const validControlSizes = require('../lib/valid-control-sizes')
const formatLog = require('../lib/format-log')
const formatTemplates = require('../lib/format-templates')
const log = require('../lib/log')
const CWD = process.cwd()
const { getPropertyId } = require('../lib/get-property-and-experience-ids')
const { getTemplates } = require('../lib/get-templates')

module.exports = async function create (pid) {
  const propertyId = await getPropertyId(pid)
  if (!propertyId) {
    log.info(`PropertyId not found, are you in an experience folder?`)
    return
  }
  const templates = await getTemplates(propertyId)
  let selectedTemplate = null

  if (templates.length) {
    selectedTemplate = await input.select(
      formatLog(`   Please select a template you'd like to create this experience from:`),
      formatTemplates(templates),
      { default: null }
    )
  }

  const name = clean(await input.text(
    formatLog('   What would you like to call your experience?'),
    { default: 'Created by Qubit-CLI' }
  ))
  const controlDecimal = await input.select(formatLog('   Select control size'), validControlSizes, { default: 0.5 })
  await createExperience(CWD, propertyId, name, controlDecimal, selectedTemplate)
}

function clean (str) {
  return str.trim()
}
