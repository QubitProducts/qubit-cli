const input = require('../lib/input')
const createExperience = require('../lib/create-experience')
const validControlSizes = require('../lib/valid-control-sizes')
const formatLog = require('../lib/format-log')
const formatTemplates = require('../lib/format-templates')
const log = require('../lib/log')
const CWD = process.cwd()

const { getPropertyId } = require('../lib/get-property-and-experience-ids')
const { getAll } = require('../services/templates')

module.exports = async function create (pid) {
  try {
    const propertyId = await getPropertyId(pid)
    if (!propertyId) {
      log.info(`PropertyId not found, are you in an experience folder?`)
      return
    }
    const templates = await getAll(propertyId)
    const wantTemplate = await input.select(
      formatLog(`   Would you like to create this experience from a template?`),
      [
        { name: '   Yes', value: true },
        { name: '   No', value: false }
      ],
      { default: true }
    )
    let selectedTemplate = null
    if (wantTemplate) {
      selectedTemplate = await input.select(
        formatLog(`   Please select a template you'd like to create this experience from:`),
        formatTemplates(templates)
      )
    }

    const name = clean(await input.text(
      formatLog('   What would you like to call your experience?'),
      { default: 'Created by Qubit-CLI' }
    ))
    const controlDecimal = await input.select(formatLog('   Select control size'), validControlSizes, { default: 0.5 })
    await createExperience(CWD, propertyId, name, controlDecimal, selectedTemplate)
  } catch (err) {
    log.error(err)
  }
}

function clean (str) {
  return str.trim()
}
