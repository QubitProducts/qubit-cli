const fetch = require('../lib/fetch')

function get (iterationId) {
  return fetch.get(`/api/iterations/${iterationId}/qfns`)
}

module.exports = { get }
