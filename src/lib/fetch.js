const config = require('config')
const axios = require('axios')
const updateAccessToken = require('../cmd/login').updateAccessToken
const auth = require('./auth')
const log = require('./log')
const refresh = require('../server/lib/refresh')
const NOT_FOUND = new Error('NOT_FOUND, the experience you requested does not exist')

module.exports = {
  get: fetchWithAuth('GET'),
  put: fetchWithAuth('PUT'),
  post: fetchWithAuth('POST')
}

function fetchWithAuth (method) {
  return async function fetch (path, data) {
    const auths = await auth.get()

    if (!updateAccessToken(auths.ID_TOKEN) && !auths.COOKIE) {
      throw new Error('You should login with `xp login`')
    }

    let headers

    if (auths.BEARER_TOKEN) {
      headers = { 'Authorization': `Bearer ${auths.BEARER_TOKEN}` }
    } else if (auths.COOKIE) {
      headers = { 'Cookie': `apsess=${auths.COOKIE}` }
    }

    console.log('POSTING STUFF', config.endpoint + path, { data, headers })
    return axios(config.endpoint + path, { method, data, headers })
      .then(handler, handler)

    function handler (resp) {
      if (resp.status === 404) throw NOT_FOUND
      if (typeof resp.data === 'string' && resp.data.includes('login.css')) {
        log.error('UNAUTHORIZED')
        return refresh().then(() => fetch(path, data))
      }
      return resp.data
    }
  }
}
