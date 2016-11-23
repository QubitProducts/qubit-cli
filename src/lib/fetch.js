const config = require('config')
const auth = require('./auth')
const axios = require('axios')

module.exports = {
  get: fetchWithAuth('GET'),
  put: fetchWithAuth('PUT')
}

function fetchWithAuth (method) {
  return function (path, data) {
    return auth.get().then((auths) => {
      if (!auths.authToken && !auths.COOKIE) {
        throw new Error('UNAUTHORIZED, please visit an experiment editor page')
      }

      let headers
      if (auths.authToken) {
        headers = { 'Authorization': `Bearer: ${auths.authToken}` }
      } else if (auths.COOKIE) {
        headers = { 'Cookie': `apsess=${auths.COOKIE}` }
      }

      return axios(config.endpoint + path, {
        method,
        data,
        headers
      }).then((resp) => resp.data)
    })
  }
}
