const path = require('path')
const config = require('../../config')
const https = require('https')
const enableDestroy = require('server-destroy')
const express = require('express')
const bodyParser = require('body-parser')
const getCerts = require('../lib/get-certs')
const favicon = require('serve-favicon')

module.exports = async function app () {
  const certs = await getCerts()
  const app = express()
  const server = https.createServer(certs, app)
  app.server = server
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
  app.use(bodyParser.json())
  app.start = () => new Promise((resolve, reject) => {
    enableDestroy(server)
    server.listen(config.port, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
  app.stop = () => new Promise((resolve) => server.destroy(resolve))
  return app
}
