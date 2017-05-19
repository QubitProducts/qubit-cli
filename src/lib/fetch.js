const config = require('../../config')
const axios = require('axios')
const auth = require('./auth')
const log = require('./log')
const getToken = require('./get-token')
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
    const auths = await auth.get()

    if (auths.ID_TOKEN) {
      try {
        token = await getToken(auths.ID_TOKEN)
        headers = { 'Authorization': `Bearer ${token}` }
      } catch (err) {
        log('Could not authenticate, reinitiating login flow')
      }
    }

    if (!headers) return login().then(() => fetch(path, data))

    return axios(config.endpoint + path, { method, data, headers }).then(handler, handler)

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
