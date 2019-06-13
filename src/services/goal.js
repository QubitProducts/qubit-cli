const fetch = require('../lib/fetch')

function get (iterationId) {
  return fetch.get(`/api/iterations/${iterationId}/goals`)
}

function set (iterationId, goals) {
  return fetch.post(`/api/iterations/${iterationId}/goals`, { goals })
}

module.exports = { get, set }
