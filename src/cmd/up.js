const experienceCodeService = require('../services/experience-code')
const pkgService = require('../services/pkg')
const log = require('../lib/log')
const readFiles = require('../lib/read-files')
let CWD = process.cwd()

module.exports = function up () {
  log('syncing...')
  return readFiles(CWD)
    .then(experienceCodeService.validateFiles)
    .then(function (files) {
      let {propertyId, experienceId} = pkgService.parse(files['package.json']).meta
      return experienceCodeService.get(propertyId, experienceId).then((experience) => {
        return experienceCodeService.update(CWD, experience, files)
      })
    })
    .then(() => {
      process.stdout.moveCursor(0, -1)
      process.stdout.clearScreenDown()
      log('synced!')
    })
    .catch(log.error)
}
