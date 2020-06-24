const cookieman = require('cookieman')
const _ = require('slapdash')
const ms = require('ms')
const KEYS = 'qubit-cli-keys'

module.exports = cookieDomain => {
  return {
    get: cookieman.val,
    getAll,
    set,
    clear: cookieman.clear,
    clearAll: cookieman.clearAll
  }

  function getAll () {
    const keys = getKeys()
    return cookieman.cookies().reduce((memo, val) => {
      if (keys.includes(val.name)) {
        memo[val.name] = val.value
      }
      return memo
    }, {})
  }

  function set (key, value, options = {}) {
    addKey(key)
    cookieman.set(key, value, {
      path: '/',
      domain: cookieDomain,
      expires: options.expires || new Date(Date.now() + ms('1y'))
    })
  }

  function addKey (key) {
    const keys = getKeys()
    keys.push(key)
    cookieman.set(KEYS, _.unique(keys).join(','), {
      path: '/',
      domain: cookieDomain,
      expires: new Date(Date.now() + ms('1y'))
    })
  }

  function getKeys () {
    const keys = cookieman.val(KEYS)
    return _.unique(keys ? keys.split(',') : [])
  }
}
