const fs = require('fs-promise')
const installCerts = require('./install-certs')
const {CERT_PATH, KEY_PATH, CERT_DIR} = require('./constants')

module.exports = function getCerts (isRetry) {
  return Promise.all([
    fs.readFile(KEY_PATH),
    fs.readFile(CERT_PATH)
  ])
  .then(([ key, cert ]) => {
    return { key, cert }
  }, function onError (error) {
    if (error instanceof Error && error.code === 'ENOENT') {
      if (!isRetry) return installCerts().then(() => getCerts(true))
      throw new Error(`No self-signed certificates were found in ${CERT_DIR}, and xp-cli could not automatically solve this.`)
    }
    throw error
  })
}
