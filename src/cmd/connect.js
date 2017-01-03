const config = require('config')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const getCerts = require('../lib/get-certs')
const log = require('../lib/log')
const app = express()

module.exports = async function connect () {
  try {
    const certs = await getCerts()
    app.use(bodyParser.json())
    app.post('/connect', require('../server/routes/connect'))
    const server = https.createServer(certs, app)
    server.listen(config.port, () => log('navigate to an `edit experience` page for xp to connect to it'))
    return server
  } catch (e) {
    log.error(e)
  }
}
