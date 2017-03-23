const path = require('path')
const input = require('input')
const experienceService = require('../services/experience')
const codeService = require('../services/code')
const experienceFilename = require('../lib/experience-filename')
const validControlSizes = require('../lib/valid-control-sizes')
const scaffold = require('../lib/scaffold')
const log = require('../lib/log')
let CWD = process.cwd()

module.exports = async function create (propertyId) {
  try {
    propertyId = Number(propertyId)
    if (!propertyId) return log(`Please specify a propertyId!`)

    let name = clean(await input.text('What would you like to call your experience?', { default: 'Created by xp' }))
    let controlDecimal = await input.select(`Select control size:`, validControlSizes, { default: 0.5 })
    let recentIterations = buildRecentIterations(controlDecimal)
    let experience = await experienceService.create({ propertyId, name, recent_iterations: recentIterations })

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

function buildRecentIterations (controlDecimal) {
  return { 'draft': { 'control_size': controlDecimal } }
}

function clean (str) {
  return str.trim()
}
