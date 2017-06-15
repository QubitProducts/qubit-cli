const now = require('now-plus')
let cm = require('cookieman')

// controls what other experiences should fire, if any
module.exports = function others (also, cookieDomain) {
  restore()
  const cookieValue = JSON.stringify({
    experiences: also || [],
    preview: true
  })
  const cookieOptions = { path: '/', domain: cookieDomain, expires: now.plus(15, 'minutes') }
  cm.set('qb_opts', encodeURIComponent(cookieValue), cookieOptions)
}

function restore () {
  cm.clearAll('qb_opts')
}
