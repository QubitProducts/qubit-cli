const config = require('../../config')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const xprc = require('./xprc')

module.exports = async function getToken (idToken, targetClientId, options = {}) {
  if (!idToken) return false
  let currentToken = (await xprc.get()).BEARER_TOKEN
  if (!currentToken || isExpired(currentToken) || options.force) {
    currentToken = await fetchToken(idToken, targetClientId)
  }
  return currentToken
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

function isExpired (token) {
  if (!token) return true
  let buffer = 10
  return jwt.decode(token).exp < Math.round(Date.now() / 1000 + buffer)
}
