const fetch = require('../lib/fetch')

function get () {
  return fetch.get('/api/user/properties')
}

module.exports = { get }
