// Based on https://auth0.com/docs/tutorials/using-auth0-to-secure-an-api

var opn = require('opn')
var crypto = require('crypto')
var config = require('config')
var express = require('express')
var qs = require('qs')
var axios = require('axios')
var jwt = require('jsonwebtoken')
var auth = require('../lib/auth')

const PORT = config.auth.port

module.exports = login
module.exports.updateAccessToken = updateAccessToken

function login () {
  // Generate the verifier, and the corresponding challenge
  var verifier = base64url(crypto.randomBytes(32))
  var verifierChallenge = base64url(crypto.createHash('sha256').update(verifier).digest())

  // Create the callback service
  var app = express()
  app.get('/callback', callback(verifier))
  var server = app.listen(PORT, () => openLoginPage(verifierChallenge))

  function openLoginPage (verifierChallenge) {
    // Create an authorize URL
    var authorizeUrl = config.auth.url + '/authorize?' + qs.stringify({
      'response_type': 'code',
      'scope': 'openid profile',
      'client_id': config.auth.xpClientId,
      'redirect_uri': redirectUri(),
      'code_challenge': verifierChallenge,
      'code_challenge_method': 'S256'
    })

    // Open a browser and initiate the authentication process with Auth0
    console.log('Opening ' + authorizeUrl)
    console.log('If this didn\'t work, please open this URL in your browser manually.')
    opn(authorizeUrl)
  }

  function callback (verifier) {
    return async function callbackRoute (req, res, next) {
      var code = req.query.code
      var response = await axios.post(config.auth.url + '/oauth/token', {
        code: code,
        code_verifier: verifier,
        client_id: config.auth.xpClientId,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri()
      })
      var idToken = response.data.id_token

      // save the id_token, we'll use this to generate
      // bearer access tokens later.
      auth.set('ID_TOKEN', idToken)

      await updateAccessToken(idToken, { force: true })

      res.send('Logged in. You can now close this tab.')
      server.close()
      process.exit()
    }
  }
}

async function updateAccessToken (idToken, options = {}) {
  if (!idToken) {
    return false
  }

  var currentToken = await (auth.get()).BEARER_TOKEN

  if (options.force || isExpired(currentToken)) {
    // get delegated authToken for app.qubit.com
    var response = await axios.post(config.auth.url + '/delegation', {
      client_id: config.auth.xpClientId,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      id_token: idToken,
      api_type: 'auth0',
      target: config.auth.apertureClientId,
      scope: 'openid'
    })

    auth.set('BEARER_TOKEN', response.data.id_token)
  }

  return true
}

function redirectUri () {
  return 'http://localhost:' + PORT + '/callback'
}

function base64url (b) {
  return b.toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '')
}

function isExpired (token) {
  if (!token) return true
  let buffer = 10
  return jwt.decode(token).exp < Math.round(Date.now() / 1000 + buffer)
}
