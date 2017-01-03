const codeService = require('../services/code')
const log = require('../lib/log')
const scaffold = require('../lib/scaffold')
let CWD = process.cwd()

module.exports = async function down (propertyId, experienceId) {
  try {
    log('pulling...')
    const files = await codeService.get(propertyId, experienceId)
    await scaffold(CWD, files, false)
    log('pulled!')
  } catch (err) {
    log.error(err)
  }
}
