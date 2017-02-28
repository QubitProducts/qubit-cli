const codeService = require('../services/code')
const log = require('../lib/log')
const scaffold = require('../lib/scaffold')
const getPkg = require('../lib/get-pkg')
const mergePkg = require('../lib/merge-pkg')
let CWD = process.cwd()

module.exports = async function down (propertyId, experienceId) {
  const localPkg = await getPkg()
  const files = await codeService.get(propertyId, experienceId)
  files['package.json'] = JSON.stringify(mergePkg(localPkg, files['package.json']), null, 2)
  log('pulling...')
  await scaffold(CWD, files, false, true)
  log('pulled!')
}
