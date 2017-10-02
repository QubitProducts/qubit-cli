const config = require('../../config')
const axios = require('axios')
const xprc = require('./xprc')
const log = require('./log')
const ensureToken = require('./ensure-token')
const login = require('../server/lib/login')
const NOT_FOUND = new Error('NOT_FOUND, the experience you requested does not exist')
const OUT_OF_DATE = new Error('OUT_OF_DATE, your local copy of the experience is out of date')

module.exports = {
  get: fetchWithAuth('GET'),
  put: fetchWithAuth('PUT'),
  post: fetchWithAuth('POST')
}

function fetchWithAuth (method) {
  return async function fetch (path, data) {
    let headers, token
    const auths = await xprc.get()

    if (auths.ID_TOKEN) {
      try {
        token = await ensureToken(auths.ID_TOKEN, config.auth.apertureClientId)
        await xprc.set('BEARER_TOKEN', token)
        headers = { 'Authorization': `Bearer ${token}` }
      } catch (err) {
        log('Could not authenticate, reinitiating login flow')
      }
    }

    if (!headers) return login().then(() => fetch(path, data))

    return axios(config.services.app + path, { method, data, headers }).then(handler, ({response}) => handler(response))

    function handler (resp) {
      if (resp.status === 422) throw OUT_OF_DATE
      if (resp.status === 404) throw NOT_FOUND
      if (typeof resp.data === 'string' && resp.data.includes('login.css')) {
        log.error('UNAUTHORIZED')
        return login().then(() => fetch(path, data))
      }
      if (resp.data === 'Unauthorized') return login().then(() => fetch(path, data))
      return resp.data
    }
  }
}
