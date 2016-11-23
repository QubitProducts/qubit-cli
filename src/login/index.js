// Based on https://auth0.com/docs/tutorials/using-auth0-to-secure-an-api

var opn = require('opn')
var crypto = require('crypto')
var config = require('config')
var express = require('express')
var qs = require('qs')
var axios = require('axios')
var homedir = require('os-homedir')
var path = require('path')
var fs = require('fs')

const XPRC = path.join(homedir(), '.xprc')
const PORT = config.auth.port

module.exports = function login () {
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
    return function callbackRoute (req, res, next) {
      var code = req.query.code

      axios.post(config.auth.url + '/oauth/token', {
        code: code,
        code_verifier: verifier,
        client_id: config.auth.xpClientId,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri()
      }).then(function (response) {
        console.log('GOT TOKEN', response.data.id_token)
        // get delegated authToken for app.qubit.com
        return axios.post(config.auth.url + '/delegation', {
          client_id: config.auth.xpClientId,
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          id_token: response.data.id_token,
          api_type: 'auth0',
          target: config.auth.appClientId,
          scope: 'openid'
        })
      }).then(function (response) {
        console.log('GOTS IT', response.data)
        fs.writeFileSync(XPRC, JSON.stringify({ authToken: response.data.id_token }))
        console.log('Logged in.')
        res.send('Logged in. You can now close this tab.')
        server.close()
        process.exit()
      }).catch(function (err) {
        if (err instanceof Error) {
          throw err
        } else {
          throw new Error(err.data.error_description)
        }
      })
    }
  }
}

function redirectUri () {
  return 'http://localhost:' + PORT + '/callback'
}

function base64url(b) {
  return b.toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '')
}
