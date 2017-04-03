const fetch = require('../lib/fetch')

function get (meta) {
  return fetch.get(getPath(meta))
}

function set (meta, goals) {
  return fetch.post(getPath(meta, true), { goals })
}

function getPath (meta, isSet) {
  const path = isSet ? 'sync' : ''
  const { propertyId, experienceId, iterationId } = meta

  return `/p/${propertyId}/smart_serve/experiments/${experienceId}/iterations/${iterationId}/goals/${path}`
}

module.exports = { get, set }
