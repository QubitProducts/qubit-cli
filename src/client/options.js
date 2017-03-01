const experienceState = {}
const _ = require('lodash')
const defaultVisitor = require('./visitor')

module.exports = function transform (pkg, key) {
  const variationOpts = _.get(pkg, `pkg.meta.variations.${key}`) || {}
  const meta = Object.assign({}, pkg.meta, variationOpts)
  const visitor = Object.assign({}, defaultVisitor, _.get(pkg.meta.visitor))
  delete meta.visitor

  function set (key, data) {
    experienceState[key] = data
  }

  function get (key) {
    return experienceState[key]
  }

  delete meta.variations

  meta.experimentId = meta.experimentId || meta.experienceId
  meta.experienceId = meta.experimentId
  meta.cookieDomain = meta.cookieDomain || window.location.host
  meta.trackingId = meta.trackingId || 'qubitproducts'
  meta.visitorId = meta.visitorId || String(Math.random()).substr(2)

  return {
    state: {
      get: get,
      set: set
    },
    getVisitorState: () => _.cloneDeep(visitor),
    meta: meta
  }
}
