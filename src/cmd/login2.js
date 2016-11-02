var express = require('express')
var qs = require('querystring')
var open = require('open')
var axios = require('axios')

var authorizeUrl = 'http://localhost:3030/oauth2/authorize'
var exchangeUrl = 'http://localhost:3030/oauth2/token'
var clientId = 'abc123'
var clientSecret = 'ssh-secret'
var scope = ['experience:write']

module.exports = function login () {
  var server, redirectUri
  var app = express()

  app.get('/', function (req, res, next) {
    var code = req.query.code
    axios.post(exchangeUrl, {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code
    }).then(function (response) {
      console.log('Logged in', response.data)
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
  })

  server = app.listen(function () {
    var port = server.address().port

    redirectUri = 'http://localhost:' + port + '/'

    var loginUrl = authorizeUrl + '?' + qs.stringify({
      redirect_uri: redirectUri,
      client_id: clientId,
      scope: scope,
      response_type: 'code'
    })

    console.log('Opening ' + loginUrl)
    console.log('If this didn\'t work, please open this URL in your browser manually.')
    open(loginUrl)
  })
}
