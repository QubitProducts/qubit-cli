const codeService = require('../services/code')
const log = require('../lib/log')
const scaffold = require('../lib/scaffold')
let CWD = process.cwd()

module.exports = async function down (propertyId, experienceId) {
  const files = await codeService.get(propertyId, experienceId)
  log('pulling...')
  await scaffold(CWD, files, false)
  log('pulled!')
}
