const https = require('https')
const getCerts = require('../lib/https')
const log = require('../lib/log')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

module.exports = function connect (opts) {
  return getCerts()
    .then((certs) => {
      app.use(bodyParser.json())
      app.post('/connect', require('../server/routes/connect'))
      const server = https.createServer(certs, app)
      server.listen(opts.parent.port, () => {
        log('navigate to an `edit experience` page for xp to connect to it')
      })
      return server
    })
    .catch(console.error)
}
