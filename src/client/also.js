const now = require('now-plus')
let cm = require('cookieman')

// controls what other experiences to fire, if any
module.exports = function others (also, cookieDomain) {
  const cookieOptions = { path: '/', domain: cookieDomain, expires: now.plus(15, 'minutes') }

  cm.clearAll('etcForceCreative')
  cm.clearAll('smartserve_preview')

  if (also !== 'all') {
    if (also && also.length) {
      // load ss preview if also parameter includes other experience ids
      cm.set('smartserve_preview', 'true', cookieOptions)
    } else {
      // force no other experiences to run
      also = [-1]
    }

    // force other experiences to also run
    cm.set('etcForceCreative', encodeURIComponent('[' + also.join(',') + ']'), cookieOptions)
  }
}
