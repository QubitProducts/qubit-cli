const axios = require('axios')
const config = require('../../config')

module.exports = async function revokeRefreshToken (token) {
  return axios.post(config.services.auth + '/oauth/revoke', {
    client_id: config.auth.cliClientId,
    token
  })
}
