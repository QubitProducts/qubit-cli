const config = require('config')
const axios = require('axios')
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
    if (auths.TOKEN) throw new Error('Auth type not implemented yet')
    return axios(config.endpoint + path, {
      method,
      data,
      headers: { 'Cookie': `apsess=${auths.COOKIE}` }
    })
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

  // return function (path, data) {
  //   return auth.get().then((auths) => {
  //     if (!auths.authToken && !auths.COOKIE) {
  //       throw new Error('UNAUTHORIZED, please visit an experiment editor page')
  //     }

  //     let headers
  //     if (auths.authToken) {
  //       headers = { 'Authorization': `Bearer: ${auths.authToken}` }
  //     } else if (auths.COOKIE) {
  //       headers = { 'Cookie': `apsess=${auths.COOKIE}` }
  //     }

  //     return axios(config.endpoint + path, {
  //       method,
  //       data,
  //       headers
  //     }).then((resp) => resp.data)