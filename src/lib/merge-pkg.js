const _ = require('lodash')

module.exports = function mergePkg (localPkg, remotePkg) {
  localPkg = localPkg || {}
  remotePkg = remotePkg || {}
  if (typeof localPkg === 'string') localPkg = JSON.parse(localPkg)
  if (typeof remotePkg === 'string') remotePkg = JSON.parse(remotePkg)
  const pkg = Object.assign({}, localPkg, remotePkg)
  _.set(pkg, 'meta', _.merge({}, localPkg.meta, remotePkg.meta) || {})
  _.set(pkg, 'meta.templates', _.uniq(getTemplates(localPkg).concat(getTemplates(remotePkg))))
  return pkg
}

function getTemplates (pkg) {
  return _.get(pkg, 'meta.templates') || []
}
