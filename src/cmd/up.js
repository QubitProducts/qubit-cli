const codeService = require('../services/code')
const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const readFiles = require('../lib/read-files')
let CWD = process.cwd()

module.exports = async function up () {
  try {
    log('syncing...')
    const pkg = await getPkg()
    const {propertyId, experienceId} = pkg.meta
    await codeService.set(propertyId, experienceId, await readFiles(CWD))
    log('synced!')
  } catch (e) {
    log.error(e)
  }
}
