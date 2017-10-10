const axios = require('axios')
const crypto = require('crypto')
const opn = require('opn')
const qs = require('qs')
const config = require('../../../config')
const qubtrc = require('../../lib/qubitrc')
const log = require('../../lib/log')
const createApp = require('../app')
const setup = require('../../lib/setup')

module.exports = async function login () {
  let idToken = await qubtrc.get('ID_TOKEN')

  // try to login with existing token if it exists
  if (idToken) {
    try {
      return await setup(idToken)
    } catch (err) {}
  }

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
        idToken = await getIdToken(req.query.code, verifier)
        await setup(idToken)
        res.send('You are now logged in!. You can now close this tab.')
        await app.stop()
        resolve()
      } catch (err) {
        log.error(String(err))
        res.end()
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
