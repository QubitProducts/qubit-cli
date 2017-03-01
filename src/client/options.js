const experienceState = {}

module.exports = function transform (pkg, key) {
  const variationOpts = (pkg && pkg.meta && pkg.meta.variations && pkg.meta.variations[key]) || {}
  const meta = Object.assign({}, pkg.meta, variationOpts)

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
    meta: meta
  }
}
