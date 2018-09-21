const _ = require('lodash')
const ms = require('ms')
const axios = require('axios')
const exists = require('./exists')
const config = require('../../config')
const getToken = require('../server/lib/token')
const tokenHasExpired = require('./token-has-expired')
const qubitrc = require('./qubitrc')
const log = require('./log')
const { APP_TOKEN, REGISTRY_TOKEN, ID_TOKEN, NPMRC } = require('../constants')

async function getDelegateToken (tokenOpts, targetClientId) {
  const response = await axios.post(config.services.auth + '/delegation', {
    target: targetClientId,
    client_id: config.auth.cliClientId,
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    api_type: 'auth0',
    scope: 'openid profile offline_access',
    ...tokenOpts
  })
  return response.data.id_token
}

async function getAppToken (force) {
  let appToken = await qubitrc.get(APP_TOKEN)
  if (force || tokenHasExpired(appToken, Date.now(), ms('5 minutes'))) {
    if (!force && appToken) log.warn('Your app token has expired, fetching a new one')
    log.debug('Fetching app token')
    const tokenOpts = await getTokenOpts()
    appToken = await getDelegateToken(tokenOpts, config.auth.apertureClientId)
    await qubitrc.set(APP_TOKEN, appToken)
  }
  return appToken
}

async function getRegistryToken (force) {
  let registryToken = await qubitrc.get(REGISTRY_TOKEN)
  if (force || tokenHasExpired(registryToken, Date.now(), ms('6 hours')) || !await exists(NPMRC)) {
    if (!force && registryToken) log.debug('Your registry token is missing or about to expire, fetching a new one')
    log.debug('Fetching registry token')
    const tokenOpts = await getTokenOpts()
    registryToken = await getDelegateToken(tokenOpts, config.auth.registryClientId)
    let { accessToken, scopes } = (await axios.post(config.services.registry + '/-/token', {}, {
      headers: { Authorization: `Bearer ${registryToken}` }
    })).data
    registryToken = accessToken
    await qubitrc.login(registryToken, _.uniq(scopes))
  }
  return registryToken
}

async function getTokenOpts () {
  if (process.env.QUBIT_TOKEN) return { refresh_token: process.env.QUBIT_TOKEN }
  let token = await qubitrc.get(ID_TOKEN)
  if (tokenHasExpired(token, Date.now(), ms('1 day'))) {
    const token = await getToken(
      'id_token',
      'openid profile offline_access',
      'You are logged in! You can now close this tab.'
    )
    await qubitrc.set(ID_TOKEN, token)
  }
  return { id_token: token }
}

module.exports = { getAppToken, getRegistryToken, getTokenOpts }
