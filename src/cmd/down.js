const codeService = require('../services/code')
const log = require('../lib/log')
const scaffold = require('../lib/scaffold')
const getPkg = require('../lib/get-pkg')
let CWD = process.cwd()

module.exports = async function down () {
  try {
    log('pulling...')
    const pkg = await getPkg()
    const {propertyId, experienceId} = pkg.meta
    const files = await codeService.get(propertyId, experienceId)
    await scaffold(CWD, files, false)
    log('pulled!')
  } catch (e) {
    log.error(e)
  }
}
