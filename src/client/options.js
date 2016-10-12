module.exports = function transform (pkg, key) {
  var variationOpts = (pkg.meta.variations && pkg.meta.variations[key]) || {}
  var meta = Object.assign({}, pkg.meta, variationOpts)
  delete meta.variations
  meta.experimentId = meta.experimentId || meta.experienceId
  meta.experienceId = meta.experimentId
  meta.cookieDomain = meta.cookieDomain || window.location.host
  meta.trackingId = meta.trackingId || 'qubitproducts'
  meta.visitorId = meta.visitorId || String(Math.random()).substr(2)
  return { meta: meta }
}
