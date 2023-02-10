const devcert = require('devcert')
const fs = require('fs-extra')
const log = require('./log')
const { CERT_DIR, CERT_PATH, KEY_PATH } = require('../constants')

module.exports = async function setup () {
  log.info(
    "We'll now generate a TSL certificate and install it into your OS as a trusted certificate"
  )
  log.info(
    "This is to make sure that browsers don't block Qubit-CLI from serving to https sites"
  )

  const { key, cert } = await devcert.certificateFor('localhost')

  await fs.mkdirp(CERT_DIR)
  await Promise.all([
    fs.writeFile(KEY_PATH, key),
    fs.writeFile(CERT_PATH, cert)
  ])
}
