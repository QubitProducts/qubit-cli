const renameFileWarning = require('./rename-file-warning')

module.exports = async function commonCodeWarning (dest) {
  return renameFileWarning(dest, 'common.js', 'utils.js')
}
