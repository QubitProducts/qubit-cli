const fetch = require('../lib/fetch')
const memoize = require('p-memoize')

const getAll = memoize(async function getAll () {
  return fetch.get('/api/user/properties')
})

async function get (propertyId) {
  return getAll().then(all => all.find(p => p.id === propertyId))
}

module.exports = { get, getAll }
