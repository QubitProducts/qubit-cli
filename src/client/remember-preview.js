var cookie = require('cookieman')
var now = require('now-plus')

module.exports = function rememberPreview (minutes, additionalVariations, domain) {
  if (additionalVariations && additionalVariations.length) {
    var variations = window.encodeURIComponent('[' + additionalVariations.join(',') + ']')
    var cookieOptions = {
      expires: now.plus(minutes || 15, 'minutes'),
      path: '/',
      domain: domain
    }

    cookie.set('smartserve_preview', 'true', cookieOptions)
    cookie.set('etcForceCreative', variations, cookieOptions)
  }
}
