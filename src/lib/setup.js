const _ = require('lodash')
const execa = require('execa').shell
const axios = require('axios')
const ms = require('ms')
const config = require('../../config')
const qubitrc = require('./qubitrc')
const log = require('./log')
const getToken = require('./get-token')
const tokenHasExpired = require('./token-has-expired')
const { ID_TOKEN, REGISTRY_TOKEN, REGISTRY_SCOPES } = require('./constants')

module.exports = async function setup (idToken) {
  await Promise.all([
    updateQUBITRC(idToken),
    updateNPMRC(idToken)
  ])
  return log.info('Login successful!')
}

async function updateQUBITRC (idToken) {
  await qubitrc.set(ID_TOKEN, idToken)
}

async function updateNPMRC (idToken) {
  let { accessToken, scopes } = await getRegistryToken(idToken)
  await saveRegistryToken(accessToken, scopes)
}

async function getRegistryToken (idToken) {
  let registryToken = await qubitrc.get(REGISTRY_TOKEN)
  let registryScopes = await qubitrc.get(REGISTRY_SCOPES)
  if (registryScopes && !tokenHasExpired(registryToken, Date.now(), ms('1 day'))) {
    return { accessToken: registryToken, scopes: registryScopes }
  }
  if (registryToken) log.warn('Your registry token has expired, fetching a new one')
  registryToken = await getToken(idToken, config.auth.registryClientId)
  return (await axios.post(config.services.registry + '/-/token', {}, {
    headers: { 'Authorization': `Bearer ${registryToken}` }
  })).data
}

async function saveRegistryToken (registryToken, scopes) {
  scopes = _.uniq(scopes.concat(['@qubit', '@qutics']))
  await qubitrc.set(REGISTRY_TOKEN, registryToken)
  await qubitrc.set(REGISTRY_SCOPES, scopes)
  const authKey = config.services.registry.replace(/^https?:/, '')
  // always ensure that @qubit and @qutics scopes are configured
  for (let scope of scopes) await execa(`npm config set ${scope}:registry ${config.services.registry}/`)
  await execa(`npm config set ${authKey}/:_authToken ${registryToken}`)
}
