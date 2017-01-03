const codeService = require('../services/code')
const log = require('../lib/log')
const readFiles = require('../lib/read-files')
let CWD = process.cwd()

module.exports = async function up (propertyId, experienceId) {
  log('pushing...')
  await codeService.set(propertyId, experienceId, await readFiles(CWD))
  log('pushed!')
}
