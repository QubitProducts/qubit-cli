const axios = require('axios')
const config = require('../../config')
const tokenHasExpired = require('./token-has-expired')
const qubitrc = require('./qubitrc')
const {APP_TOKEN} = require('./constants')

module.exports = async function getToken (idToken, targetClientId, options = {}) {
  if (!idToken) return false
  let appToken = await qubitrc.get(APP_TOKEN)
  if (!appToken || tokenHasExpired(appToken) || options.force) {
    appToken = await fetchToken(idToken, targetClientId)
  }
  return appToken
}

async function fetchToken (idToken, targetClientId) {
  const response = await axios.post(config.services.auth + '/delegation', {
    client_id: config.auth.xpClientId,
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    id_token: idToken,
    api_type: 'auth0',
    target: targetClientId,
    scope: 'openid'
  })
  return response.data.id_token
}
