const path = require('path')
const input = require('input')
const experienceService = require('../services/experience')
const codeService = require('../services/code')
const experienceFilename = require('../lib/experience-filename')
const controlSize = require('../lib/control-size')
const scaffold = require('../lib/scaffold')
const log = require('../lib/log')
let CWD = process.cwd()

module.exports = async function create (propertyId) {
  try {
    propertyId = Number(propertyId)
    if (!propertyId) return log(`Please specify a propertyId!`)

    let name = clean(await input.text('What would you like to call your experience?', { default: 'Created by xp' }))
    let validControlSizes = controlSize.validControlSizes.join(', ')
    let controlDecimal = Number(clean(await input.text(`Set control size (${validControlSizes})`, { default: '0.5' })))

    if (controlSize.isInvalid(controlDecimal)) {
      return log(`Invalid control size ${controlDecimal}, must be one of ${validControlSizes}`)
    }

    let experience = await experienceService.create(propertyId, name, controlDecimal)

    if (!experience.id) return log(`I'm afraid we could not create an experience at this time`)
    log(`creating experience`)

    const files = await codeService.get(propertyId, experience.id)
    const filename = experienceFilename(experience)
    const dest = path.join(CWD, filename)

    await scaffold(dest, files, false)
    log(`created at ${filename}`)
  } catch (err) {
    log.error(err)
  }
}

function clean (str) {
  return str.trim()
}
