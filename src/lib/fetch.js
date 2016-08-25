const auth = require('./auth')
const axios = require('axios')

module.exports = {
  get: fetchWithAuth('GET'),
  put: fetchWithAuth('PUT')
}

function fetchWithAuth (method) {
  return function (domain, path, data) {
    return auth.get(domain).then((auths) => {
      if (auths.TOKEN) throw new Error('Auth type not implemented yet')
      if (auths.COOKIE) {
        return axios(domain + path, {
          method,
          data,
          headers: { 'Cookie': `apsess=${auths.COOKIE}` }
        }).then((resp) => resp.data)
      }
      throw new Error('UNAUTHORIZED, please visit an experiment editor page')
    })
  }
}
