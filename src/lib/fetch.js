const config = require('../../config')
const axios = require('axios')
const qubitrc = require('./qubitrc')
const log = require('./log')
const ensureToken = require('./ensure-token')
const login = require('../server/lib/login')
const { ID_TOKEN } = require('./constants')

module.exports = {
  get: fetchWithAuth('GET'),
  put: fetchWithAuth('PUT'),
  post: fetchWithAuth('POST')
}

function fetchWithAuth (method) {
  return async function fetch (path, data, isRetry) {
    let headers, token
    const idToken = await qubitrc.get(ID_TOKEN)
    const url = config.services.app + path

    if (idToken) {
      try {
        token = await ensureToken(idToken, config.auth.apertureClientId)
        headers = { 'Authorization': `Bearer ${token}` }
      } catch (err) {
        log.error('Could not authenticate, reinitiating login flow')
      }
    }

    if (!headers) return login().then(() => fetch(path, data))

    return axios(url, { method, data, headers }).then(handler, ({response}) => handler(response))

    function handler (resp) {
      if (resp.status === 422) {
        log.error(`Unprocessable entity at url ${url}`)
        return process.exit(1)
      }
      if (resp.status === 404) {
        log.error(`Nothing found at url ${url}`)
        return process.exit(1)
      }
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
