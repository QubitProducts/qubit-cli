const axios = require('axios')
const crypto = require('crypto')
const opn = require('opn')
const qs = require('qs')
const ms = require('ms')
const config = require('../../../config')
const createApp = require('../app')
const log = require('../../lib/log')
const qubitrc = require('../../lib/qubitrc')
const tokenHasExpired = require('../../lib/token-has-expired')
const { getRegistryToken } = require('../../lib/get-token')
const { ID_TOKEN } = require('../../constants')

module.exports = async function login (forceRefresh) {
  forceRefresh = forceRefresh || await qubitrc.switched()
  let idToken = await qubitrc.get(ID_TOKEN)
  // try to login with existing token if it exists
  if (!tokenHasExpired(idToken, Date.now(), ms('1 day'))) {
    try {
      await getRegistryToken(() => idToken, forceRefresh)
      return idToken
    } catch (err) {
      return log.error(err)
    }
  }

  if (idToken) log.debug('Your id token has expired, fetching a new one')

  let app = await createApp()
  await app.start()

  const verifier = base64url(crypto.randomBytes(32))
  const verifierChallenge = base64url(crypto.createHash('sha256').update(verifier).digest())
  const loginUrl = getLoginUrl(verifierChallenge)

  opn(loginUrl, { wait: false })

  log.info(`Please log in...`)

  log.info(`Opening login url: ${loginUrl}`)

  return new Promise((resolve, reject) => {
    app.get('/callback', async (req, res, next) => {
      try {
        idToken = await getIdToken(req.query.code, verifier)
        await qubitrc.set(ID_TOKEN, idToken)
        await getRegistryToken(() => idToken, forceRefresh)
        res.send('You are now logged in!. You can now close this tab.')
        await app.stop()
        resolve(idToken)
      } catch (err) {
        res.end()
        log.error(err)
        reject(err)
      }
    })
  })
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
