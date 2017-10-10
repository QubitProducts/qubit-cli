const _ = require('lodash')
const execa = require('execa').shell
const axios = require('axios')
const config = require('../../config')
const qubtrc = require('./qubitrc')
const log = require('./log')
const getToken = require('./get-token')

module.exports = async function setup (idToken) {
  await updateQUBITRC(idToken)
  await updateNPMRC(idToken)
  return log('login successful!')
}

async function updateQUBITRC (idToken) {
  await qubtrc.set('ID_TOKEN', idToken)
  await qubtrc.rm('BEARER_TOKEN', idToken)
}

async function updateNPMRC (idToken) {
  let {accessToken, scopes} = await getRegistryToken(idToken)
  await saveRegistryToken(accessToken, scopes)
}

async function getRegistryToken (idToken) {
  let auth0Token = await getToken(idToken, config.auth.registryClientId)
  return (await axios.post(config.services.registry + '/-/token', {}, {
    headers: { 'Authorization': `Bearer ${auth0Token}` }
  })).data
}

async function saveRegistryToken (accessToken, scopes) {
  const authKey = config.services.registry.replace(/^https?:/, '')
  // always ensure that @qubit and @qutics scopes are configured
  scopes = _.uniq(scopes.concat(['@qubit', '@qutics']))
  for (let scope of scopes) await execa(`npm config set ${scope}:registry ${config.services.registry}/`)
  await execa(`npm config set ${authKey}/:_authToken ${accessToken}`)
}
