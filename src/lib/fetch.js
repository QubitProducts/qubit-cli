const config = require('../../config')
const axios = require('axios')
const qubitrc = require('./qubitrc')
const log = require('./log')
const ensureToken = require('./ensure-token')
const login = require('../server/lib/login')
const { ID_TOKEN } = require('./constants')
const NOT_FOUND = new Error('NOT_FOUND, the experience you requested does not exist')
const OUT_OF_DATE = new Error('OUT_OF_DATE, your local copy of the experience is out of date')

module.exports = {
  get: fetchWithAuth('GET'),
  put: fetchWithAuth('PUT'),
  post: fetchWithAuth('POST')
}

function fetchWithAuth (method) {
  return async function fetch (path, data, isRetry) {
    let headers, token
    const idToken = await qubitrc.get(ID_TOKEN)

    if (idToken) {
      try {
        token = await ensureToken(idToken, config.auth.apertureClientId)
        headers = { 'Authorization': `Bearer ${token}` }
      } catch (err) {
        log.error('Could not authenticate, reinitiating login flow')
      }
    }

    if (!headers) return login().then(() => fetch(path, data))

    return axios(config.services.app + path, { method, data, headers }).then(handler, ({response}) => handler(response))

    function handler (resp) {
      if (resp.status === 422) throw OUT_OF_DATE
      if (resp.status === 404) throw NOT_FOUND
      if (resp.data === 'Unauthorized' || (typeof resp.data === 'string' && resp.data.includes('login.css'))) {
        if (isRetry) {
          log.error('Credentials rejected after several attempts')
          process.exit()
        } else {
          return login().then(() => fetch(path, data, true))
        }
      }
      return resp.data
    }
  }
}
