const now = require('now-plus')
let cm = require('cookieman')

// controls what other experiences should fire, if any
module.exports = function previewSettings (meta, also, exclude) {
  cm.clearAll('qb_opts')
  exclude = exclude || []
  let previewOptions = { preview: meta.isPreview, exclude: exclude.concat(meta.experienceId) }
  if (also) previewOptions.experiences = also
  const cookieValue = JSON.stringify(previewOptions)
  const cookieOptions = { path: '/', domain: meta.cookieDomain, expires: now.plus(15, 'minutes') }
  cm.set('qb_opts', encodeURIComponent(cookieValue), cookieOptions)
}
