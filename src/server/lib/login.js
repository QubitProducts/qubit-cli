const execa = require('execa').shell
const axios = require('axios')
const crypto = require('crypto')
const opn = require('opn')
const qs = require('qs')
const config = require('../../../config')
const xprc = require('../../lib/xprc')
const log = require('../../lib/log')
const createApp = require('../app')
const getToken = require('../../lib/get-token')

module.exports = async function login () {
  let app = await createApp()
  await app.start()

  const verifier = base64url(crypto.randomBytes(32))
  const verifierChallenge = base64url(crypto.createHash('sha256').update(verifier).digest())
  const loginUrl = getLoginUrl(verifierChallenge)

  opn(loginUrl, { wait: false })

  log(`please log in...`)

  log(`opening login url: ${loginUrl}`)

  return new Promise((resolve) => {
    app.get('/callback', async (req, res, next) => {
      try {
        const idToken = await getIdToken(req.query.code, verifier)
        await xprc.rm('BEARER_TOKEN', idToken)
        await xprc.set('ID_TOKEN', idToken)

        let {accessToken, scopes} = await getRegistryToken(idToken)
        await saveRegistryToken(accessToken, scopes)

        res.send('You are now logged in!. You can now close this tab.')
        await app.stop()
        log('login successful!')
        resolve()
      } catch (err) {
        log.error(String(err))
        res.end()
      }
    })
  })
}

async function getRegistryToken (idToken) {
  let auth0Token = await getToken(idToken, config.auth.registryClientId)
  return (await axios.post(config.services.registry + '/-/token', {}, {
    headers: { 'Authorization': `Bearer ${auth0Token}` }
  })).data
}

async function saveRegistryToken (accessToken, scopes) {
  const authKey = config.services.registry.replace(/^https?:/, '')
  for (let scope of scopes) await execa(`npm config set ${scope}:registry ${config.services.registry}/`)
  await execa(`npm config set ${authKey}/:_authToken ${accessToken}`)
}

function getLoginUrl (verifierChallenge) {
  return config.services.auth + '/authorize?' + qs.stringify({
    'response_type': 'code',
    'scope': 'openid profile',
    'client_id': config.auth.xpClientId,
    'redirect_uri': redirectUri(),
    'code_challenge': verifierChallenge,
    'code_challenge_method': 'S256'
  })
}

async function getIdToken (code, verifier) {
  const response = await axios.post(config.services.auth + '/oauth/token', {
    code: code,
    code_verifier: verifier,
    client_id: config.auth.xpClientId,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri()
  })
  return response.data.id_token
}

function redirectUri () {
  return `https://localhost:${config.port}/callback`
}

function base64url (b) {
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
