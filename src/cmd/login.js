const config = require('config')
const qs = require('urlite/querystring')
const https = require('https')
const axios = require('axios')
const util = require('util')
const crypto = require('crypto')
const express = require('express')
const bodyParser = require('body-parser')
const opn = require('opn')
const getCerts = require('../lib/https')
const log = require('../lib/log')

module.exports = function connect (opts) {
  let verifier = base64url(crypto.randomBytes(32))
  let challenge = base64url(crypto.createHash('sha256').update(verifier).digest())

  createServer()

  opn(`${config.auth.host}${qs.stringify(Object.assign({}, config.auth.options, {
    code_challenge: challenge,
    code_challenge_method: 'S256'
  }))}`)

  function createServer () {
    return getCerts().then((certs) => {
      const app = express()
      app.use(bodyParser.json())
      const server = https.createServer(certs, app)
      app.get('/callback', function (req, res, next) {
        axios.post(`${config.auth.host}/oauth/token`, Object.assign({}, config.auth.options, {
          code: req.query.code,
          code_verifier: verifier,
          grant_type: 'authorization_code'
        }))
        .then((resp) => {
          log(util.inspect(resp.data))
          res.end()
        })
        .catch((e) => console.log(arguments))
      })
      server.listen(config.port, () => log('please log in with your qubit credentials'))
      return server
    }).catch(console.error)
  }
}

function base64url (b) {
  return b.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
