const experienceService = require('../services/experience')
const codeService = require('../services/code')
const scaffold = require('../lib/scaffold')
const log = require('../lib/log')
let CWD = process.cwd()

module.exports = async function create (propertyId) {
  try {
    propertyId = Number(propertyId)
    if (!propertyId) throw new Error('please specify a propertyId')
    let experience = await experienceService.create(propertyId)
    if (!experience.id) throw new Error('failed to create experience')
    log(`created experience ${experience.id}`)
    const files = await codeService.get(propertyId, experience.id)
    await scaffold(CWD, files, false)
    log('synced!')
  } catch (err) {
    log.error(err)
  }
}
