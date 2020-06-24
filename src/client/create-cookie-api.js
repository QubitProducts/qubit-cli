const cookieman = require('cookieman')
const ms = require('ms')

module.exports = cookieDomain => {
  return {
    get: cookieman.val,
    getAll: cookieman.getCookies,
    set,
    clear: cookieman.clear,
    clearAll: cookieman.clearAll
  }

  function set (key, value, options = {}) {
    cookieman.set(key, value, {
      path: '/',
      domain: cookieDomain,
      expires: options.expires || new Date(Date.now() + ms('1y'))
    })
  }
}
