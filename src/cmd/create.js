const path = require('path')
const input = require('input')
const experienceService = require('../services/experience')
const codeService = require('../services/code')
const experienceFilename = require('../lib/experience-filename')
const scaffold = require('../lib/scaffold')
const log = require('../lib/log')
let CWD = process.cwd()

module.exports = async function create (propertyId) {
  try {
    propertyId = Number(propertyId)
    if (!propertyId) return log(`Please specify a propertyId!`)
    let name = clean(await input.text('What would you like to call your experience?', { default: 'Created by xp' }))
    let experience = await experienceService.create(propertyId, name)
    if (!experience.id) return log(`I'm afraid we could not create an experience at this time`)
    log(`created experience ${experience.id}`)
    const files = await codeService.get(propertyId, experience.id)
    const dest = path.join(CWD, experienceFilename(experience))
    await scaffold(dest, files, false)
    log('synced!')
  } catch (err) {
    log.error(err)
  }
}

function clean (str) {
  return str.trim()
}
