const fetch = require('../lib/fetch')

function get (meta) {
  return fetch.get(`/api/iterations/${meta.iterationId}/goals`)
}

function set (meta, goals) {
  return fetch.post(`/api/iterations/${meta.iterationId}/goals`, { goals })
}

module.exports = { get, set }
