const now = require('now-plus')
let cm = require('cookieman')

// controls what other experiences should fire, if any
module.exports = function others (also, cookieDomain) {
  const cookieOptions = { path: '/', domain: cookieDomain, expires: now.plus(15, 'minutes') }
  restore()
  cm.set('smartserve_preview', 'true', cookieOptions)
  cm.set('etcForceCreative', encodeURIComponent('[' + (also || []).join(',') + ']'), cookieOptions)
}

function restore () {
  cm.clearAll('smartserve_preview')
  cm.clearAll('etcForceCreative')
}
