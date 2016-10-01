const path = require('path')
const experienceCodeService = require('../services/experience-code')
const pkgService = require('../services/pkg')
const log = require('../lib/log')
const {readFile} = require('fs-promise')
let CWD = process.cwd()

module.exports = function down () {
  log('pulling...')
  return readFile(path.join(CWD, 'package.json'))
    .then(pkgService.parse)
    .then(pkgService.validate)
    .then((pkg) => {
      let {propertyId, experienceId} = pkg.meta
      return experienceCodeService.writeToLocal(CWD, propertyId, experienceId)
    })
    .then(() => {
      process.stdout.moveCursor(0, -1)
      process.stdout.clearScreenDown()
      log('pulled!')
    })
    .catch(log.error)
}
