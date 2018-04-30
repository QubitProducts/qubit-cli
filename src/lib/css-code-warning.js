const _ = require('lodash')
const getPkg = require('./get-pkg')
const renameFileWarning = require('./rename-file-warning')

module.exports = async function cssCodeWarning (dest) {
  const pkg = await getPkg(dest)
  const variations = _.get(pkg, 'meta.variations')
  if (variations) {
    return Promise.all(
      Object
        .keys(variations)
        .map(
          async name => renameFileWarning(dest, `${name}.css`, `${name}.less`)
        )
    )
  }
}
