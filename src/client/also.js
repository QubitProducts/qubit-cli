const now = require('now-plus')
let cm = require('cookieman')

// controls what other experiences to fire, if any
module.exports = function others (also, cookieDomain) {
  const cookieOptions = { path: '/', domain: cookieDomain, expires: now.plus(15, 'minutes') }

  cm.set('smartserve_preview', 'true', cookieOptions)
  cm.clearAll('etcForceCreative')

  if (also !== 'all') {
    // force no other experiences to run
    if (!also || !also.length) also = [-1]

    // force other experiences to also run
    cm.set('etcForceCreative', encodeURIComponent('[' + also.join(',') + ']'), cookieOptions)
  }
}
