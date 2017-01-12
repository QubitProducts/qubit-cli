const config = require('config')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const auth = require('./auth')

module.exports = async function getToken (idToken, options = {}) {
  if (!idToken) return false
  let currentToken = (await auth.get()).BEARER_TOKEN
  if (!currentToken || isExpired(currentToken) || options.force) {
    currentToken = await fetchToken(idToken)
    await auth.set('BEARER_TOKEN', currentToken)
  }
  return currentToken
}

async function fetchToken (idToken) {
  const response = await axios.post(config.auth.url + '/delegation', {
    client_id: config.auth.xpClientId,
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    id_token: idToken,
    api_type: 'auth0',
    target: config.auth.apertureClientId,
    scope: 'openid'
  })
  return response.data.id_token
}

function isExpired (token) {
  if (!token) return true
  let buffer = 10
  return jwt.decode(token).exp < Math.round(Date.now() / 1000 + buffer)
}
