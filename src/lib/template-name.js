const path = require('path')

module.exports = function formatTemplateName (name) {
  let top = path.basename(name)
  top = `xp-tmp-${top.replace(/(xp-tmp-)+/, '')}`
  return path.join(path.dirname(name), top)
}
