const auth = require('./auth')
const axios = require('axios')

module.exports = {
  get: fetchWithAuth('get'),
  put: fetchWithAuth('put')
}

function fetchWithAuth (method) {
  return function (domain, path, data) {
    return auth.get(domain).then((auths) => {
      if (auths.TOKEN) throw new Error('Auth type not implemented yet')
      if (auths.COOKIE) {
        return axios[method](domain + path, data, {
          headers: { 'Cookie': `apsess=${auths.COOKIE}` }
        }).then((resp) => resp.data)
      }
      throw new Error('Not authorized, please visit an experiment editor page')
    })
  }
}
