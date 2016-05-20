var axios = require('axios')

module.exports = {
  get: function fetch (url, auth) {
    return axios.get(url, {
      headers: { 'Cookie': `apsess=${auth}` }
    })
  },
  put: function fetch (url, auth, data) {
    return axios.put(url, data, {
      headers: { 'Cookie': `apsess=${auth}` }
    })
  }
}
