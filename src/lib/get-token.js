const _ = require('lodash')
const ms = require('ms')
const axios = require('axios')
const exists = require('./exists')
const config = require('../../config')
const tokenHasExpired = require('./token-has-expired')
const qubitrc = require('./qubitrc')
const log = require('./log')
const { APP_TOKEN, REGISTRY_TOKEN, NPMRC } = require('../constants')

async function getToken (idToken, targetClientId) {
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

async function getAppToken (getIDToken, force) {
  let appToken = await qubitrc.get(APP_TOKEN)
  if (force || tokenHasExpired(appToken, Date.now(), ms('5 minutes'))) {
    if (!force && appToken) log.warn('Your app token has expired, fetching a new one')
    log.debug('Fetching app token')
    let idToken = await getIDToken()
    appToken = await getToken(idToken, config.auth.apertureClientId)
    await qubitrc.set(APP_TOKEN, appToken)
  }
  return appToken
}

async function getRegistryToken (getIDToken, forceRefresh) {
  let registryToken = await qubitrc.get(REGISTRY_TOKEN)
  if (forceRefresh || tokenHasExpired(registryToken, Date.now(), ms('6 hours')) || !await exists(NPMRC)) {
    if (!forceRefresh && registryToken) log.debug('Your registry token is missing or about to expire, fetching a new one')
    log.debug('Fetching registry token')
    let idToken = await getIDToken()
    registryToken = await getToken(idToken, config.auth.registryClientId)
    let { accessToken, scopes } = (await axios.post(config.services.registry + '/-/token', {}, {
      headers: { 'Authorization': `Bearer ${registryToken}` }
    })).data
    scopes = _.uniq(scopes.concat(['@qubit', '@qutics']))
    registryToken = accessToken
    await qubitrc.login(registryToken, scopes)
  }
  return registryToken
}

module.exports = { getAppToken, getRegistryToken }
