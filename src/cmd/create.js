const input = require('../lib/input')
const createExperience = require('../lib/create-experience')
const validControlSizes = require('../lib/valid-control-sizes')
const formatLog = require('../lib/format-log')
const formatTemplates = require('../lib/format-templates')
const CWD = process.cwd()
const { getPropertyId } = require('../lib/get-resource-ids')
const { getPublishedTemplates } = require('../lib/get-templates')

module.exports = async function create (pid, name, traffic, templateId = null) {
  const propertyId = await getPropertyId(pid)

  const isProgrammatic = pid && name && traffic && !templateId
  const templates = await getPublishedTemplates(propertyId)

  if (templates.length && !isProgrammatic) {
    templateId = await input.select(
      formatLog(`   Please select a template you'd like to create this experience from:`),
      formatTemplates(templates),
      { default: null }
    )
  }

  if (!name) {
    name = clean(await input.text(
      formatLog('   What would you like to call your experience?'),
      { default: 'Created by Qubit-CLI' }
    ))
  }
  const controlDecimal = traffic || await input.select(formatLog('   Select control size'), validControlSizes, { default: 0.5 })
  await createExperience(CWD, propertyId, name, controlDecimal, templateId)
}

function clean (str) {
  return str.trim()
}
