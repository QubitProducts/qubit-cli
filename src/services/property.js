const fetch = require('../lib/fetch')

function get (propertyId) {
  return fetch.get(`/api/properties/${propertyId}`)
}

function getAll () {
  return fetch.get('/api/user/properties')
}

module.exports = { get, getAll }
