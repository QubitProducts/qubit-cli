const _ = require('lodash')

module.exports = function mergePkg (localPkg, remotePkg) {
  if (!localPkg) return remotePkg
  localPkg = localPkg || {}
  remotePkg = remotePkg || {}
  if (typeof localPkg === 'string') localPkg = JSON.parse(localPkg)
  if (typeof remotePkg === 'string') remotePkg = JSON.parse(remotePkg)
  const pkg = { ...localPkg, ...remotePkg }
  _.set(pkg, 'meta', { ...localPkg.meta, ...remotePkg.meta })
  _.set(pkg, 'meta.templates', _.uniq(getTemplates(localPkg).concat(getTemplates(remotePkg))))
  const remoteTemplateData = _.get(remotePkg, 'meta.templateData') || {}
  const localTemplateData = _.get(localPkg, 'meta.templateData') || {}
  if (_.isEmpty(remoteTemplateData)) {
    // Don't wipe local template data unless there is remote template data
    _.set(pkg, 'meta.templateData', localTemplateData)
  } else {
    _.set(pkg, 'meta.templateData', remoteTemplateData)
  }

  ;[
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'bundledDependencies',
    'bundleDependencies',
    'optionalDependencies'
  ].forEach(key => pkg[key] && remotePkg[key] && _.set(pkg, key, { ...localPkg[key], ...remotePkg[key] }))

  if (_.get(remotePkg, 'meta.variations')) pkg.meta.variations = remotePkg.meta.variations
  const {
    name,
    version,
    description,
    keywords,
    homepage,
    bugs,
    license,
    author,
    contributors,
    files,
    main,
    bin,
    man,
    directories,
    repository,
    scripts,
    browser,
    dependencies,
    devDependencies,
    peerDependencies,
    bundledDependencies,
    bundleDependencies,
    optionalDependencies,
    engines,
    engineStrict,
    meta
  } = pkg
  return _.omitBy({
    name,
    version,
    description,
    keywords,
    homepage,
    bugs,
    license,
    author,
    contributors,
    files,
    main,
    bin,
    man,
    directories,
    repository,
    scripts,
    browser,
    dependencies,
    devDependencies,
    peerDependencies,
    bundledDependencies,
    bundleDependencies,
    optionalDependencies,
    engines,
    engineStrict,
    ...pkg,
    meta: _.omitBy(meta, _.isUndefined)
  }, _.isUndefined)
}

function getTemplates (pkg) {
  return _.get(pkg, 'meta.templates') || []
}
