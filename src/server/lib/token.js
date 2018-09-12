const path = require('path')
const axios = require('axios')
const fs = require('fs-extra')
const crypto = require('crypto')
const opn = require('opn')
const qs = require('qs')
const config = require('../../../config')
const createApp = require('../app')
const log = require('../../lib/log')
const REDIRECT_URI = `https://localhost:${config.port}/callback`

module.exports = async function getPrimaryToken (name, scope, message) {
  let token
  const app = await createApp()
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
        token = await swapCodeForToken(req.query.code, verifier)
        const response = String(await fs.readFile(path.join(__dirname, '../public', 'index.html')))
        res.send(response.replace(/{{message}}/, message))
        await app.stop()
        resolve(token)
      } catch (err) {
        res.end()
        log.error(err)
        reject(err)
      }
    })
  })

  function getLoginUrl (verifierChallenge) {
    return config.services.auth + '/authorize?' + qs.stringify({
      response_type: 'code',
      scope,
      client_id: config.auth.cliClientId,
      redirect_uri: REDIRECT_URI,
      code_challenge: verifierChallenge,
      code_challenge_method: 'S256'
    })
  }

  async function swapCodeForToken (code, verifier) {
    const response = await axios.post(config.services.auth + '/oauth/token', {
      code: code,
      code_verifier: verifier,
      client_id: config.auth.cliClientId,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI
    })
    return response.data[name]
  }
}

function base64url (b) {
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
