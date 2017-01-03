const config = require('config')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const log = require('../lib/log')
const getCerts = require('../lib/get-certs')

module.exports = async function app () {
  const certs = await getCerts()
  const app = express()
  const server = https.createServer(certs, app)
  app.server = server
  app.use(bodyParser.json())
  app.start = () => new Promise((resolve, reject) => {
    server.listen(config.port, (err) => {
      if (err) return reject(err)
      log(`xp listening on port ${config.port}`)
      resolve()
    })
  })
  app.stop = () => server.close()
  return app
}
